/**
 * PayoffChart — from-scratch Canvas 2D P&L diagram for option strategies.
 * Profit/loss shaded curve, zero line, breakeven + spot markers, and a hover
 * readout of P&L at any underlying price. No external chart library.
 */
export interface PayoffPoint { spot: number; pnl: number; }

export interface PayoffData {
  curve: PayoffPoint[];
  spot: number;
  breakevens: number[];
}

const PADL = 8, PADR = 8, PADT = 14, PADB = 20;

export class PayoffChart {
  private cv: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private d: PayoffData | null = null;
  private cssW = 0; private cssH = 0; private dpr = 1;
  private mouseX: number | null = null;
  private ro?: ResizeObserver;

  constructor(private host: HTMLElement) {
    host.style.position = "relative";
    this.cv = document.createElement("canvas");
    Object.assign(this.cv.style, { width: "100%", height: "100%", display: "block" });
    host.appendChild(this.cv);
    this.ctx = this.cv.getContext("2d")!;
    this.cv.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX - this.cv.getBoundingClientRect().left; this.draw();
    });
    this.cv.addEventListener("mouseleave", () => { this.mouseX = null; this.draw(); });
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
  }

  setData(d: PayoffData) { this.d = d; this.draw(); }
  destroy() { this.ro?.disconnect(); this.host.innerHTML = ""; }

  private resize() {
    const r = this.host.getBoundingClientRect();
    this.cssW = r.width; this.cssH = r.height;
    this.dpr = window.devicePixelRatio || 1;
    this.cv.width = Math.round(this.cssW * this.dpr);
    this.cv.height = Math.round(this.cssH * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.draw();
  }

  private draw() {
    const ctx = this.ctx, W = this.cssW, H = this.cssH;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#111417"; ctx.fillRect(0, 0, W, H);
    if (!this.d || this.d.curve.length < 2) return;

    const { curve, spot, breakevens } = this.d;
    const xs = curve.map((c) => c.spot), ys = curve.map((c) => c.pnl);
    const xmin = xs[0], xmax = xs[xs.length - 1];
    let ymin = Math.min(...ys), ymax = Math.max(...ys);
    const yp = (ymax - ymin) * 0.12 || 1; ymin -= yp; ymax += yp;

    const px = (s: number) => PADL + (s - xmin) / (xmax - xmin) * (W - PADL - PADR);
    const py = (p: number) => PADT + (ymax - p) / (ymax - ymin) * (H - PADT - PADB);
    const y0 = py(0);

    // zero line
    ctx.strokeStyle = "#2a2f36"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PADL, y0); ctx.lineTo(W - PADR, y0); ctx.stroke();

    // profit (green) / loss (red) fills, clipped at the zero line
    const drawFill = (above: boolean, color: string) => {
      ctx.save(); ctx.beginPath();
      ctx.rect(0, above ? 0 : y0, W, above ? y0 : H - y0); ctx.clip();
      ctx.beginPath(); ctx.moveTo(px(curve[0].spot), y0);
      for (const c of curve) ctx.lineTo(px(c.spot), py(c.pnl));
      ctx.lineTo(px(curve[curve.length - 1].spot), y0); ctx.closePath();
      ctx.fillStyle = color; ctx.fill(); ctx.restore();
    };
    drawFill(true, "rgba(38,166,91,0.18)");
    drawFill(false, "rgba(224,82,75,0.18)");

    // P&L curve
    ctx.strokeStyle = "#d6d9dc"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    curve.forEach((c, i) => (i ? ctx.lineTo(px(c.spot), py(c.pnl)) : ctx.moveTo(px(c.spot), py(c.pnl))));
    ctx.stroke();

    ctx.font = "10px Consolas, monospace"; ctx.textBaseline = "top";
    // breakevens
    ctx.setLineDash([3, 3]); ctx.strokeStyle = "#b3a000"; ctx.fillStyle = "#b3a000";
    for (const be of breakevens) {
      const x = px(be);
      ctx.beginPath(); ctx.moveTo(x, PADT); ctx.lineTo(x, H - PADB); ctx.stroke();
      ctx.textAlign = "center"; ctx.fillText(be.toFixed(0), x, H - PADB + 4);
    }
    ctx.setLineDash([]);
    // current spot
    const xsSpot = px(spot);
    ctx.strokeStyle = "#ff9e00"; ctx.fillStyle = "#ff9e00";
    ctx.beginPath(); ctx.moveTo(xsSpot, PADT); ctx.lineTo(xsSpot, H - PADB); ctx.stroke();
    ctx.textAlign = "center"; ctx.fillText("spot " + spot.toFixed(0), xsSpot, PADT - 12 < 0 ? PADT : 2);

    // hover readout
    if (this.mouseX !== null) {
      const s = xmin + (this.mouseX - PADL) / (W - PADL - PADR) * (xmax - xmin);
      if (s >= xmin && s <= xmax) {
        const i = Math.round((s - xmin) / (xmax - xmin) * (curve.length - 1));
        const c = curve[Math.max(0, Math.min(curve.length - 1, i))];
        const x = px(c.spot), y = py(c.pnl);
        ctx.setLineDash([2, 2]); ctx.strokeStyle = "#8a929b";
        ctx.beginPath(); ctx.moveTo(x, PADT); ctx.lineTo(x, H - PADB); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = c.pnl >= 0 ? "#26a65b" : "#e0524b";
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        const label = `${c.spot.toFixed(0)}  ₹${c.pnl >= 0 ? "+" : ""}${Math.round(c.pnl).toLocaleString("en-IN")}`;
        ctx.textAlign = x > W / 2 ? "right" : "left";
        ctx.fillStyle = "#d6d9dc"; ctx.textBaseline = "top";
        ctx.fillText(label, x + (x > W / 2 ? -6 : 6), 4);
      }
    }
  }
}
