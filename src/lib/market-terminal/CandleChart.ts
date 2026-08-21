/**
 * CandleChart — a from-scratch HTML5 Canvas candlestick engine.
 *
 * No external charting library (no lightweight-charts / TradingView). Pure
 * Canvas 2D: candles + volume + grid + price/time axes + crosshair with an
 * OHLC legend, wheel-zoom, drag-pan, live update, DPR-crisp rendering and a
 * left-edge callback for historical pagination.
 *
 * Two layered canvases: `base` (data — redrawn only on data/viewport change)
 * and `overlay` (crosshair/legend — redrawn on mouse move). The overlay layer
 * is also where drawing tools (trendlines / fib) would hook in.
 *
 * X-axis date/time formatting is handled entirely by chartTimeAxis.ts —
 * a pure utility with no DOM/Canvas dependencies. CandleChart only renders
 * the ticks it receives; all granularity/timezone/boundary logic lives there.
 */
import { pickAxisTicks, formatCrosshairTime, type ChartInterval } from './chartTimeAxis'
export interface Bar {
  time: number;   // unix seconds
  open: number; high: number; low: number; close: number;
  volume?: number;
}

export type ChartTool = "none" | "trend" | "hray" | "fib";
interface Anchor { i: number; p: number; }               // bar index (float) + price
interface Drawing { tool: ChartTool; a: Anchor; b: Anchor; }

export interface OverlayLine { title: string; color: string; width: number; values: (number | null)[]; }
export interface ShapeSeries { color: string; above: boolean; values: (number | null)[]; }  // plotshape markers
export interface IndicatorPane {
  title: string;
  lines: OverlayLine[];
  hlines: { price: number; color: string; title: string }[];
}

export interface CandleChartOptions {
  bg?: string; grid?: string; text?: string;
  up?: string; down?: string; volUp?: string; volDown?: string;
  crosshair?: string;
  interval?: ChartInterval;   // active timeframe — drives X-axis label granularity
  onReachLeft?: () => void;   // fired when the user scrolls near the oldest bar
  onReachRight?: () => void;  // fired when the user scrolls near the newest bar
}

const DEFAULTS: Required<Omit<CandleChartOptions, "onReachLeft" | "onReachRight">> = {
  bg: "#111417", grid: "#1c2126", text: "#7d848c",
  up: "#26a65b", down: "#e0524b",
  volUp: "rgba(38,166,91,0.35)", volDown: "rgba(224,82,75,0.35)",
  crosshair: "#8a929b",
  interval: "1d",
};

const AXIS_W = 62;    // right price-axis gutter
const TIME_H = 30;    // bottom time-axis gutter (30px to accommodate two-line intraday labels)
const VOL_FRAC = 0.22; // fraction of plot height reserved for volume

export class CandleChart {
  private base: HTMLCanvasElement;
  private overlay: HTMLCanvasElement;
  private bctx: CanvasRenderingContext2D;
  private octx: CanvasRenderingContext2D;
  private opt: Required<Omit<CandleChartOptions, "onReachLeft" | "onReachRight">> & Pick<CandleChartOptions, "onReachLeft" | "onReachRight">;

  private data: Bar[] = [];
  private overlays: OverlayLine[] = [];   // indicator lines on the price pane
  private panes: IndicatorPane[] = [];    // oscillator sub-panes (RSI, MACD…)
  private shapes: ShapeSeries[] = [];     // plotshape markers on the price pane
  private tool: ChartTool = "none";       // active drawing tool
  private drawings: Drawing[] = [];       // committed drawings (data-space)
  private pending: Anchor | null = null;  // first click of a 2-point drawing
  private pmin = 0; private pmax = 1;     // last price bounds (for coord mapping)
  private barW = 8;          // px per bar (zoom)
  private rightIdx = 0;      // data index aligned to the right edge of the plot (float)
  private cssW = 0; private cssH = 0; private dpr = 1;

  private dragging = false;
  private lastX = 0;
  private mouse: { x: number; y: number } | null = null;
  private ro?: ResizeObserver;

  constructor(private container: HTMLElement, options: CandleChartOptions = {}) {
    this.opt = { ...DEFAULTS, ...options };
    container.style.position = "relative";
    this.base = this.mkCanvas(1);
    this.overlay = this.mkCanvas(2);
    this.bctx = this.base.getContext("2d")!;
    this.octx = this.overlay.getContext("2d")!;

    this.overlay.addEventListener("wheel", this.onWheel, { passive: false });
    this.overlay.addEventListener("mousedown", this.onDown);
    window.addEventListener("mousemove", this.onMove);
    window.addEventListener("mouseup", this.onUp);
    this.overlay.addEventListener("mouseleave", this.onLeave);
    this.overlay.addEventListener("dblclick", () => this.fitContent());

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();
  }

  private mkCanvas(z: number): HTMLCanvasElement {
    const c = document.createElement("canvas");
    Object.assign(c.style, { position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: String(z) });
    this.container.appendChild(c);
    return c;
  }

  // ---------------------------------------------------------------- public API
  setData(bars: Bar[]) {
    this.data = [...bars].sort((a, b) => a.time - b.time);
    this.fitContent();
  }

  /** Update the active interval. Triggers a redraw so the X-axis re-formats immediately. */
  setInterval(interval: ChartInterval) {
    this.opt.interval = interval;
    this.draw();
  }

  /** Set indicator outputs: overlay lines + oscillator panes + shape markers. */
  setIndicators(overlays: OverlayLine[], panes: IndicatorPane[], shapes: ShapeSeries[] = []) {
    this.overlays = overlays;
    this.panes = panes;
    this.shapes = shapes;
    this.draw();
  }
  clearIndicators() { this.overlays = []; this.panes = []; this.shapes = []; this.draw(); }

  // ---- drawing tools ----
  setTool(t: ChartTool) {
    this.tool = t; this.pending = null;
    this.overlay.style.cursor = t === "none" ? "crosshair" : "cell";
  }
  getTool() { return this.tool; }
  clearDrawings() { this.drawings = []; this.pending = null; this.draw(); }
  undoDrawing() { this.drawings.pop(); this.pending = null; this.draw(); }

  /** Prepend older bars (pagination) while keeping the current view stable. */
  prepend(older: Bar[]) {
    if (!older.length) return;
    const added = older.filter((o) => o.time < (this.data[0]?.time ?? Infinity));
    this.data = [...added, ...this.data].sort((a, b) => a.time - b.time);
    this.rightIdx += added.length;   // keep the same bars on screen
    for (const d of this.drawings) { d.a.i += added.length; d.b.i += added.length; }  // keep anchors pinned
    this.draw();
  }

  /** Live tick: replace the last bar if same timestamp, else append. */
  update(bar: Bar) {
    const n = this.data.length;
    if (n && this.data[n - 1].time === bar.time) this.data[n - 1] = bar;
    else if (n && bar.time < this.data[n - 1].time) return;
    else {
      const atRight = this.rightIdx >= n - 1.5;
      this.data.push(bar);
      if (atRight) this.rightIdx = this.data.length - 1 + this.rightMargin();
    }
    this.draw();
  }

  fitContent() {
    const n = this.data.length;
    if (!n) { this.draw(); return; }
    const plotW = this.cssW - AXIS_W;
    this.barW = Math.max(2, Math.min(24, plotW / Math.max(n, 30)));
    this.rightIdx = n - 1 + this.rightMargin();
    this.draw();
  }

  destroy() {
    this.ro?.disconnect();
    this.overlay.removeEventListener("wheel", this.onWheel);
    this.overlay.removeEventListener("mousedown", this.onDown);
    window.removeEventListener("mousemove", this.onMove);
    window.removeEventListener("mouseup", this.onUp);
    this.container.innerHTML = "";
  }

  // ---------------------------------------------------------------- geometry
  private rightMargin() { return 5; }                         // bars of empty space on the right
  private plotW() { return this.cssW - AXIS_W; }
  private plotH() { return this.cssH - TIME_H; }
  // vertical split between the price pane and stacked oscillator panes
  private paneEach() { return Math.max(60, Math.min(140, this.plotH() * 0.26)); }
  private panesTotal() { return Math.min(this.plotH() * 0.55, this.paneEach() * this.panes.length); }
  private priceH() { return this.plotH() - this.panesTotal(); }
  private xOf(i: number) { return this.plotW() - (this.rightIdx - i) * this.barW; }
  private idxAtX(x: number) { return this.rightIdx - (this.plotW() - x) / this.barW; }

  private visibleRange(): [number, number] {
    const left = Math.floor(this.idxAtX(0));
    const right = Math.ceil(this.idxAtX(this.plotW()));
    return [Math.max(0, left), Math.min(this.data.length - 1, right)];
  }

  private priceBounds(): [number, number] {
    const [a, b] = this.visibleRange();
    let lo = Infinity, hi = -Infinity;
    for (let i = a; i <= b; i++) {
      const d = this.data[i];
      if (!d) continue;
      if (d.low < lo) lo = d.low;
      if (d.high > hi) hi = d.high;
    }
    // include overlay indicator values so they never clip
    for (const ov of this.overlays) {
      for (let i = a; i <= b; i++) {
        const v = ov.values[i];
        if (v == null || isNaN(v)) continue;
        if (v < lo) lo = v; if (v > hi) hi = v;
      }
    }
    if (!isFinite(lo)) return [0, 1];
    const pad = (hi - lo) * 0.08 || hi * 0.02 || 1;
    return [lo - pad, hi + pad];
  }

  // ---------------------------------------------------------------- rendering
  private resize() {
    const r = this.container.getBoundingClientRect();
    this.cssW = r.width; this.cssH = r.height;
    this.dpr = window.devicePixelRatio || 1;
    for (const c of [this.base, this.overlay]) {
      c.width = Math.round(this.cssW * this.dpr);
      c.height = Math.round(this.cssH * this.dpr);
    }
    this.bctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.octx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.draw();
  }

  private draw() {
    const ctx = this.bctx;
    const priceH = this.priceH();
    ctx.clearRect(0, 0, this.cssW, this.cssH);
    ctx.fillStyle = this.opt.bg;
    ctx.fillRect(0, 0, this.cssW, this.cssH);
    if (!this.data.length) return;

    const [pmin, pmax] = this.priceBounds();
    this.pmin = pmin; this.pmax = pmax;              // cache for drawing-tool coords
    const yOf = (p: number) => (pmax - p) / (pmax - pmin) * priceH;
    const [a, b] = this.visibleRange();

    // volume scale (bottom band of the price pane)
    let vmax = 0;
    for (let i = a; i <= b; i++) vmax = Math.max(vmax, this.data[i].volume || 0);
    const volH = priceH * VOL_FRAC;
    const volY = (v: number) => priceH - (v / (vmax || 1)) * volH;

    this.drawGrid(ctx, pmin, pmax, yOf, a, b);

    // candles + volume
    const w = Math.max(1, this.barW * 0.7);
    for (let i = a; i <= b; i++) {
      const d = this.data[i];
      const x = this.xOf(i);
      const bull = d.close >= d.open;
      const col = bull ? this.opt.up : this.opt.down;
      // volume bar
      if (d.volume) {
        ctx.fillStyle = bull ? this.opt.volUp : this.opt.volDown;
        ctx.fillRect(x - w / 2, volY(d.volume), w, priceH - volY(d.volume));
      }
      // wick
      ctx.strokeStyle = col;
      ctx.beginPath();
      ctx.moveTo(Math.round(x) + 0.5, yOf(d.high));
      ctx.lineTo(Math.round(x) + 0.5, yOf(d.low));
      ctx.stroke();
      // body
      ctx.fillStyle = col;
      const yo = yOf(d.open), yc = yOf(d.close);
      const top = Math.min(yo, yc), h = Math.max(1, Math.abs(yc - yo));
      ctx.fillRect(x - w / 2, top, w, h);
    }

    // overlay indicator lines (SMA/EMA/BB/VWAP…) on the price pane
    for (const ov of this.overlays) this.drawLine(ctx, ov, a, b, yOf, 0, priceH);

    // plotshape markers (buy/sell triangles) on the price pane
    for (const sh of this.shapes) {
      ctx.fillStyle = sh.color;
      for (let i = a; i <= b; i++) {
        const v = sh.values[i]; if (v == null || isNaN(v)) continue;
        const x = this.xOf(i), y = yOf(v);
        ctx.beginPath();
        if (sh.above) { ctx.moveTo(x, y - 3); ctx.lineTo(x - 4, y - 10); ctx.lineTo(x + 4, y - 10); }
        else { ctx.moveTo(x, y + 3); ctx.lineTo(x - 4, y + 10); ctx.lineTo(x + 4, y + 10); }
        ctx.closePath(); ctx.fill();
      }
    }

    // oscillator sub-panes (RSI/MACD…)
    this.drawPanes(ctx, a, b, priceH);

    // committed drawings (trendlines / fib / rays)
    this.drawDrawings(ctx, yOf, priceH);

    this.drawTimeAxis(ctx, a, b);

    // fire pagination hooks near oldest / newest loaded bars
    if (a <= 2 && this.opt.onReachLeft) this.opt.onReachLeft();
    if (b >= this.data.length - 2 && this.opt.onReachRight) this.opt.onReachRight();

    if (this.mouse) this.drawOverlay();
    else this.octx.clearRect(0, 0, this.cssW, this.cssH);
  }

  private drawGrid(ctx: CanvasRenderingContext2D, pmin: number, pmax: number,
                   yOf: (p: number) => number, _a: number, _b: number) {
    const plotW = this.plotW();
    ctx.strokeStyle = this.opt.grid; ctx.fillStyle = this.opt.text;
    ctx.font = "11px Consolas, monospace"; ctx.lineWidth = 1;
    const ticks = this.niceTicks(pmin, pmax, 6);
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    for (const p of ticks) {
      const y = yOf(p);
      ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(plotW, Math.round(y) + 0.5); ctx.stroke();
      ctx.fillText(this.fmtPrice(p), plotW + 6, y);
    }
  }

  private drawTimeAxis(ctx: CanvasRenderingContext2D, a: number, b: number) {
    const plotH = this.plotH();
    const ticks = pickAxisTicks(
      this.data,
      [a, b],
      this.plotW(),
      this.opt.interval ?? '1d',
      (i) => this.xOf(i),
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (const tick of ticks) {
      const x = this.xOf(tick.barIndex);

      // vertical grid line — slightly brighter at calendar boundaries
      ctx.strokeStyle = tick.isBoundary
        ? "rgba(255,255,255,0.12)"
        : this.opt.grid;
      ctx.lineWidth = tick.isBoundary ? 1 : 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(x) + 0.5, 0);
      ctx.lineTo(Math.round(x) + 0.5, plotH);
      ctx.stroke();

      // label — handle optional two-line format ("09:15\n08 Aug")
      const lines = tick.label.split('\n');
      if (lines.length === 1) {
        ctx.fillStyle = this.opt.text;
        ctx.font = "11px Consolas, monospace";
        ctx.fillText(lines[0], x, plotH + 4);
      } else {
        // First line: time — normal colour
        ctx.fillStyle = this.opt.text;
        ctx.font = "11px Consolas, monospace";
        ctx.fillText(lines[0], x, plotH + 3);
        // Second line: date — dimmer and smaller
        ctx.fillStyle = "rgba(125,132,140,0.70)";
        ctx.font = "9px Consolas, monospace";
        ctx.fillText(lines[1], x, plotH + 16);
      }
    }
  }

  /** Draw one indicator polyline over [a,b], mapping value→y via yMap, clipped. */
  private drawLine(ctx: CanvasRenderingContext2D, ov: OverlayLine, a: number, b: number,
                   yMap: (v: number) => number, clipTop: number, clipH: number) {
    ctx.save();
    ctx.beginPath(); ctx.rect(0, clipTop, this.plotW(), clipH); ctx.clip();
    ctx.strokeStyle = ov.color; ctx.lineWidth = ov.width || 1;
    ctx.beginPath();
    let pen = false;
    for (let i = a; i <= b; i++) {
      const v = ov.values[i];
      if (v == null || isNaN(v)) { pen = false; continue; }
      const x = this.xOf(i), y = yMap(v);
      if (pen) ctx.lineTo(x, y); else { ctx.moveTo(x, y); pen = true; }
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawPanes(ctx: CanvasRenderingContext2D, a: number, b: number, priceH: number) {
    if (!this.panes.length) return;
    const plotW = this.plotW();
    const paneH = this.panesTotal() / this.panes.length;
    this.panes.forEach((pane, k) => {
      const top = priceH + k * paneH, pad = 8;
      // y-range across this pane's lines + hlines
      let lo = Infinity, hi = -Infinity;
      for (const ln of pane.lines) for (let i = a; i <= b; i++) {
        const v = ln.values[i]; if (v == null || isNaN(v)) continue;
        if (v < lo) lo = v; if (v > hi) hi = v;
      }
      for (const h of pane.hlines) { if (h.price < lo) lo = h.price; if (h.price > hi) hi = h.price; }
      if (!isFinite(lo)) { lo = 0; hi = 1; }
      if (lo === hi) { lo -= 1; hi += 1; }
      const yMap = (v: number) => top + pad + (hi - v) / (hi - lo) * (paneH - 2 * pad);

      // pane background separator
      ctx.strokeStyle = this.opt.grid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, Math.round(top) + 0.5); ctx.lineTo(plotW, Math.round(top) + 0.5); ctx.stroke();
      // hlines
      ctx.font = "10px Consolas, monospace"; ctx.textBaseline = "middle";
      for (const h of pane.hlines) {
        const y = yMap(h.price);
        ctx.strokeStyle = h.color; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(plotW, y); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = h.color; ctx.textAlign = "left"; ctx.fillText(String(h.price), plotW + 6, y);
      }
      // lines
      for (const ln of pane.lines) this.drawLine(ctx, ln, a, b, yMap, top, paneH);
      // pane title + latest values
      ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "11px Consolas, monospace";
      const idx = Math.min(this.data.length - 1, Math.max(0, Math.round(this.mouse ? this.idxAtX(this.mouse.x) : b)));
      let label = pane.title;
      for (const ln of pane.lines) { const v = ln.values[idx]; if (v != null && !isNaN(v)) label += `  ${ln.title} ${this.fmtPrice(v)}`; }
      ctx.fillStyle = this.opt.text; ctx.fillText(label, 6, top + 3);
    });
  }

  // ---- drawing tools rendering ----
  private yToPrice(y: number) { return this.pmax - (y / this.priceH()) * (this.pmax - this.pmin); }

  private drawOne(ctx: CanvasRenderingContext2D, d: Drawing, yOf: (p: number) => number, priceH: number, preview: boolean) {
    const xa = this.xOf(d.a.i), xb = this.xOf(d.b.i);
    const ya = yOf(d.a.p), yb = yOf(d.b.p);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, this.plotW(), priceH); ctx.clip();
    ctx.strokeStyle = preview ? "#8a929b" : "#ff9e00";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 1.4; ctx.font = "10px Consolas, monospace"; ctx.textBaseline = "middle";
    if (d.tool === "hray") {
      ctx.beginPath(); ctx.moveTo(0, ya); ctx.lineTo(this.plotW(), ya); ctx.stroke();
      ctx.textAlign = "left"; ctx.fillText(this.fmtPrice(d.a.p), 4, ya - 7);
    } else if (d.tool === "trend") {
      ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke();
      for (const [x, y] of [[xa, ya], [xb, yb]]) { ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); }
    } else if (d.tool === "fib") {
      const ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      const x0 = Math.min(xa, xb), x1 = Math.max(xa, xb);
      const cols = ["#7d848c", "#e0524b", "#ff9e00", "#26a65b", "#26a65b", "#4a9fd4", "#7d848c"];
      ctx.textAlign = "left";
      ratios.forEach((r, k) => {
        const p = d.a.p + (d.b.p - d.a.p) * r, y = yOf(p);
        ctx.strokeStyle = cols[k]; ctx.setLineDash(k === 0 || k === 6 ? [] : [4, 3]);
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 + 40, y); ctx.stroke();
        ctx.fillStyle = cols[k]; ctx.fillText(`${(r * 100).toFixed(1)}%  ${this.fmtPrice(p)}`, x1 + 44, y);
      });
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  private drawDrawings(ctx: CanvasRenderingContext2D, yOf: (p: number) => number, priceH: number) {
    for (const d of this.drawings) this.drawOne(ctx, d, yOf, priceH, false);
  }

  private drawOverlay() {
    const ctx = this.octx;
    ctx.clearRect(0, 0, this.cssW, this.cssH);
    if (!this.mouse || !this.data.length) return;
    const plotW = this.plotW(), plotH = this.plotH(), priceH = this.priceH();
    const idx = Math.max(0, Math.min(this.data.length - 1, Math.round(this.idxAtX(this.mouse.x))));
    const d = this.data[idx];
    const x = this.xOf(idx);
    const [pmin, pmax] = this.priceBounds();
    const priceAtY = pmax - (this.mouse.y / priceH) * (pmax - pmin);

    ctx.strokeStyle = this.opt.crosshair; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, plotH); ctx.stroke();
    if (this.mouse.y < priceH) {
      ctx.beginPath(); ctx.moveTo(0, Math.round(this.mouse.y) + 0.5); ctx.lineTo(plotW, Math.round(this.mouse.y) + 0.5); ctx.stroke();
    }
    ctx.setLineDash([]);

    // price tag on axis (price pane only)
    if (this.mouse.y < priceH) {
      ctx.fillStyle = "#000"; ctx.fillRect(plotW, this.mouse.y - 8, AXIS_W, 16);
      ctx.fillStyle = this.opt.up === "" ? "#fff" : "#d6d9dc";
      ctx.font = "11px Consolas, monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(this.fmtPrice(priceAtY), plotW + 6, this.mouse.y);
    }

    // OHLC legend
    const bull = d.close >= d.open;
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.font = "11px Consolas, monospace";
    ctx.fillStyle = bull ? this.opt.up : this.opt.down;
    const parts = [
      `O ${this.fmtPrice(d.open)}`, `H ${this.fmtPrice(d.high)}`,
      `L ${this.fmtPrice(d.low)}`, `C ${this.fmtPrice(d.close)}`,
      d.volume ? `V ${this.fmtVol(d.volume)}` : "",
    ].filter(Boolean);
    ctx.fillText(parts.join("   "), 8, 6);
    // Timestamp — always full date+time in IST regardless of chart granularity
    ctx.fillStyle = this.opt.text;
    ctx.font = "10px Consolas, monospace";
    ctx.fillText(formatCrosshairTime(d.time), 8, 21);

    // in-progress drawing preview (from first anchor to cursor)
    if (this.pending && this.tool !== "none") {
      const priceH = this.priceH();
      const yOf = (p: number) => (this.pmax - p) / (this.pmax - this.pmin) * priceH;
      const cur: Anchor = { i: this.idxAtX(this.mouse.x), p: this.yToPrice(this.mouse.y) };
      this.drawOne(ctx, { tool: this.tool, a: this.pending, b: cur }, yOf, priceH, true);
    }
  }

  // ---------------------------------------------------------------- helpers
  private niceTicks(lo: number, hi: number, n: number): number[] {
    const raw = (hi - lo) / n;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const out: number[] = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(v);
    return out;
  }
  private fmtPrice(p: number) {
    return p.toLocaleString("en-IN", { maximumFractionDigits: p < 100 ? 2 : p < 2000 ? 1 : 0 });
  }
  private fmtVol(v: number) {
    if (v >= 1e7) return (v / 1e7).toFixed(1) + "Cr";
    if (v >= 1e5) return (v / 1e5).toFixed(1) + "L";
    if (v >= 1e3) return (v / 1e3).toFixed(1) + "k";
    return String(Math.round(v));
  }
  // fmtTime and medianDt removed — superseded by chartTimeAxis.ts

  // ---------------------------------------------------------------- events
  private localX(e: MouseEvent) { return e.clientX - this.overlay.getBoundingClientRect().left; }
  private localY(e: MouseEvent) { return e.clientY - this.overlay.getBoundingClientRect().top; }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const mx = this.localX(e);
    const idxUnder = this.idxAtX(mx);

    const rawDelta = e.deltaMode === 1 ? e.deltaY * 20 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
    const clampedDelta = Math.max(-120, Math.min(120, rawDelta));
    const factor = Math.pow(1.0015, -clampedDelta);

    this.barW = Math.max(1.5, Math.min(60, this.barW * factor));
    // keep the bar under the cursor pinned
    this.rightIdx = idxUnder + (this.plotW() - mx) / this.barW;
    this.draw();
  };
  private onDown = (e: MouseEvent) => {
    if (this.tool !== "none") {                       // drawing mode: capture anchors, no pan
      const x = this.localX(e), y = this.localY(e);
      if (y > this.priceH()) return;                  // draw only in the price pane
      const pt: Anchor = { i: this.idxAtX(x), p: this.yToPrice(y) };
      if (this.tool === "hray") { this.drawings.push({ tool: "hray", a: pt, b: pt }); this.draw(); return; }
      if (!this.pending) this.pending = pt;
      else { this.drawings.push({ tool: this.tool, a: this.pending, b: pt }); this.pending = null; this.draw(); }
      return;
    }
    this.dragging = true; this.lastX = this.localX(e);
  };
  private onMove = (e: MouseEvent) => {
    const inside = e.target === this.overlay;
    const x = this.localX(e), y = this.localY(e);
    if (this.dragging) {
      this.rightIdx -= (x - this.lastX) / this.barW;
      const n = this.data.length;
      this.rightIdx = Math.max(1, Math.min(n - 1 + this.rightMargin(), this.rightIdx));
      this.lastX = x;
      this.mouse = { x, y };
      this.draw();
    } else if (inside) {
      this.mouse = { x, y };
      this.drawOverlay();
    }
  };
  private onUp = () => { this.dragging = false; };
  private onLeave = () => { this.mouse = null; this.octx.clearRect(0, 0, this.cssW, this.cssH); };
}
