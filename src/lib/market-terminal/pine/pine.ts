/**
 * pine.ts — a Pine-Script-flavoured indicator engine (subset).
 *
 * Runs real TradingView-style indicator scripts against a bar series and emits
 * plot outputs for our own Canvas chart. This is a pragmatic SUBSET — the goal
 * is to run the indicators people actually write, not to be a 1:1 Pine v5 VM.
 */

export interface Bar { time: number; open: number; high: number; low: number; close: number; volume: number; }

export interface PinePlot {
  title: string;
  color: string;
  width: number;
  kind: "line" | "hline" | "shape";
  values: (number | null)[];   // aligned to bars; null = na (not drawn)
  price?: number;              // for hline
  above?: boolean;             // for shape: draw above (true) / below (false) the bar
}
export interface PineResult {
  title: string;
  overlay: boolean;
  plots: PinePlot[];
  errors: string[];
}

// ------------------------------------------------------------------ values
type Series = { s: true; v: Float64Array };
type Tuple = { t: true; items: Val[] };
type Val = number | boolean | string | Series | Tuple | null;

const NA = NaN;
const isSeries = (x: Val): x is Series => !!x && typeof x === "object" && (x as any).s === true;
const isTuple = (x: Val): x is Tuple => !!x && typeof x === "object" && (x as any).t === true;
const mkSeries = (v: Float64Array): Series => ({ s: true, v });

// ------------------------------------------------------------------ tokenizer
type Tok = { k: string; v: string; };
const OPS = ["==", "!=", "<=", ">=", ":=", "+", "-", "*", "/", "%", "<", ">", "(", ")", "[", "]", ",", "=", "?", ":"];

function tokenize(line: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    if (c === " " || c === "\t") { i++; continue; }
    if (c === '"' || c === "'") {                       // string
      let j = i + 1, s = "";
      while (j < line.length && line[j] !== c) s += line[j++];
      toks.push({ k: "str", v: s }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(line[i + 1] || ""))) {
      let j = i, num = "";
      while (j < line.length && /[0-9.eE]/.test(line[j])) num += line[j++];
      toks.push({ k: "num", v: num }); i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {                          // identifier (dots allowed: ta.sma)
      let j = i, id = "";
      while (j < line.length && /[A-Za-z0-9_.]/.test(line[j])) id += line[j++];
      if (id === "and" || id === "or" || id === "not") toks.push({ k: "op", v: id });
      else toks.push({ k: "id", v: id });
      i = j; continue;
    }
    const two = line.slice(i, i + 2);
    if (OPS.includes(two)) { toks.push({ k: "op", v: two }); i += 2; continue; }
    if (OPS.includes(c)) { toks.push({ k: "op", v: c }); i++; continue; }
    throw new Error(`unexpected '${c}'`);
  }
  return toks;
}

// ------------------------------------------------------------------ parser (Pratt)
type Node =
  | { n: "num"; v: number } | { n: "str"; v: string } | { n: "id"; v: string }
  | { n: "bin"; op: string; a: Node; b: Node } | { n: "un"; op: string; a: Node }
  | { n: "tern"; c: Node; a: Node; b: Node } | { n: "index"; a: Node; i: Node }
  | { n: "call"; name: string; args: Node[]; kw: Record<string, Node> };

class Parser {
  p = 0;
  constructor(private t: Tok[]) {}
  peek() { return this.t[this.p]; }
  next() { return this.t[this.p++]; }
  eat(v: string) { const t = this.next(); if (!t || t.v !== v) throw new Error(`expected '${v}'`); }

  parseExpr(): Node { return this.ternary(); }
  ternary(): Node {
    let c = this.binary(0);
    if (this.peek()?.v === "?") { this.next(); const a = this.ternary(); this.eat(":"); const b = this.ternary(); return { n: "tern", c, a, b }; }
    return c;
  }
  private static PREC: Record<string, number> = {
    "or": 1, "and": 2, "==": 3, "!=": 3, "<": 4, ">": 4, "<=": 4, ">=": 4,
    "+": 5, "-": 5, "*": 6, "/": 6, "%": 6,
  };
  binary(min: number): Node {
    let left = this.unary();
    while (true) {
      const t = this.peek();
      if (!t || t.k !== "op") break;
      const prec = Parser.PREC[t.v];
      if (prec === undefined || prec < min) break;
      this.next();
      const right = this.binary(prec + 1);
      left = { n: "bin", op: t.v, a: left, b: right };
    }
    return left;
  }
  unary(): Node {
    const t = this.peek();
    if (t && (t.v === "-" || t.v === "not")) { this.next(); return { n: "un", op: t.v, a: this.unary() }; }
    return this.postfix();
  }
  postfix(): Node {
    let e = this.primary();
    while (this.peek()?.v === "[") { this.next(); const i = this.parseExpr(); this.eat("]"); e = { n: "index", a: e, i }; }
    return e;
  }
  primary(): Node {
    const t = this.next();
    if (!t) throw new Error("unexpected end");
    if (t.k === "num") return { n: "num", v: parseFloat(t.v) };
    if (t.k === "str") return { n: "str", v: t.v };
    if (t.v === "(") { const e = this.parseExpr(); this.eat(")"); return e; }
    if (t.k === "id") {
      if (this.peek()?.v === "(") return this.call(t.v);
      return { n: "id", v: t.v };
    }
    throw new Error(`unexpected '${t.v}'`);
  }
  call(name: string): Node {
    this.eat("("); const args: Node[] = []; const kw: Record<string, Node> = {};
    if (this.peek()?.v !== ")") {
      do {
        if (this.peek()?.k === "id" && this.t[this.p + 1]?.v === "=") {
          const key = this.next().v; this.next(); kw[key] = this.parseExpr();
        } else args.push(this.parseExpr());
      } while (this.peek()?.v === "," && this.next());
    }
    this.eat(")");
    return { n: "call", name, args, kw };
  }
}

// ------------------------------------------------------------------ ta helpers (vectorized)
function rollingSMA(x: Float64Array, len: number): Float64Array {
  const out = new Float64Array(x.length).fill(NA);
  let sum = 0, cnt = 0;
  for (let i = 0; i < x.length; i++) {
    const xi = x[i];
    if (!isNaN(xi)) { sum += xi; cnt++; }
    if (i >= len) { const old = x[i - len]; if (!isNaN(old)) { sum -= old; cnt--; } }
    if (i >= len - 1 && cnt === len) out[i] = sum / len;
  }
  return out;
}
function ema(x: Float64Array, len: number): Float64Array {
  const out = new Float64Array(x.length).fill(NA);
  const a = 2 / (len + 1); let prev = NA;
  for (let i = 0; i < x.length; i++) {
    const xi = x[i]; if (isNaN(xi)) continue;
    prev = isNaN(prev) ? xi : a * xi + (1 - a) * prev; out[i] = prev;
  }
  return out;
}
function rma(x: Float64Array, len: number): Float64Array {
  const out = new Float64Array(x.length).fill(NA);
  const a = 1 / len; let prev = NA, sum = 0, cnt = 0;
  for (let i = 0; i < x.length; i++) {
    const xi = x[i]; if (isNaN(xi)) continue;
    if (isNaN(prev)) { sum += xi; cnt++; if (cnt === len) { prev = sum / len; out[i] = prev; } }
    else { prev = a * xi + (1 - a) * prev; out[i] = prev; }
  }
  return out;
}
function wma(x: Float64Array, len: number): Float64Array {
  const out = new Float64Array(x.length).fill(NA); const denom = len * (len + 1) / 2;
  for (let i = len - 1; i < x.length; i++) {
    let acc = 0, ok = true;
    for (let k = 0; k < len; k++) { const xv = x[i - k]; if (isNaN(xv)) { ok = false; break; } acc += xv * (len - k); }
    if (ok) out[i] = acc / denom;
  }
  return out;
}
function rollingStd(x: Float64Array, len: number): Float64Array {
  const out = new Float64Array(x.length).fill(NA);
  for (let i = len - 1; i < x.length; i++) {
    let m = 0, ok = true;
    for (let k = 0; k < len; k++) { const xv = x[i - k]; if (isNaN(xv)) { ok = false; break; } m += xv; }
    if (!ok) continue; m /= len;
    let v = 0; for (let k = 0; k < len; k++) v += (x[i - k] - m) ** 2;
    out[i] = Math.sqrt(v / len);
  }
  return out;
}
function shift(x: Float64Array, n: number): Float64Array {
  const out = new Float64Array(x.length).fill(NA);
  for (let i = 0; i < x.length; i++) if (i - n >= 0 && i - n < x.length) out[i] = x[i - n];
  return out;
}
function change(x: Float64Array): Float64Array {
  const out = new Float64Array(x.length).fill(NA);
  for (let i = 1; i < x.length; i++) out[i] = x[i] - x[i - 1];
  return out;
}
function extreme(x: Float64Array, len: number, hi: boolean): Float64Array {
  const out = new Float64Array(x.length).fill(NA);
  for (let i = len - 1; i < x.length; i++) {
    let m = hi ? -Infinity : Infinity, ok = true;
    for (let k = 0; k < len; k++) { const xv = x[i - k]; if (isNaN(xv)) { ok = false; break; } m = hi ? Math.max(m, xv) : Math.min(m, xv); }
    if (ok) out[i] = m;
  }
  return out;
}

// ------------------------------------------------------------------ evaluator
class Interp {
  env = new Map<string, Val>();
  out: PinePlot[] = [];
  title = "Indicator";
  overlay = false;
  private palette = ["#2196f3", "#ff9e00", "#26a65b", "#e0524b", "#ab47bc", "#00bcd4"];
  private colorIdx = 0;

  constructor(private bars: Bar[]) {
    const n = bars.length;
    const col = (f: (b: Bar) => number) => { const a = new Float64Array(n); for (let i = 0; i < n; i++) a[i] = f(bars[i]); return mkSeries(a); };
    this.env.set("open", col(b => b.open)); this.env.set("high", col(b => b.high));
    this.env.set("low", col(b => b.low)); this.env.set("close", col(b => b.close));
    this.env.set("volume", col(b => b.volume));
    this.env.set("hl2", col(b => (b.high + b.low) / 2));
    this.env.set("hlc3", col(b => (b.high + b.low + b.close) / 3));
    this.env.set("ohlc4", col(b => (b.open + b.high + b.low + b.close) / 4));
    const bi = new Float64Array(n); for (let i = 0; i < n; i++) bi[i] = i; this.env.set("bar_index", mkSeries(bi));
    this.env.set("time", col(b => b.time));
    this.env.set("na", NA); this.env.set("true", true); this.env.set("false", false);
  }
  private get n() { return this.bars.length; }

  toArr(v: Val): Float64Array {
    if (isSeries(v)) return v.v;
    if (typeof v === "number") return new Float64Array(this.n).fill(v);
    if (typeof v === "boolean") return new Float64Array(this.n).fill(v ? 1 : 0);
    if (v === null) return new Float64Array(this.n).fill(NA);
    throw new Error("expected a number/series");
  }
  private num(v: Val): number { if (typeof v === "number") return v; if (isSeries(v)) return v.v[this.n - 1]; if (typeof v === "boolean") return v ? 1 : 0; return NaN; }

  run(node: Node): Val {
    switch (node.n) {
      case "num": return node.v;
      case "str": return node.v;
      case "id": {
        if (this.env.has(node.v)) return this.env.get(node.v)!;
        if (ZEROARG.has(node.v)) return BUILTIN[node.v]([], this);   // e.g. bare ta.vwap
        if (node.v.startsWith("color.")) return COLORS[node.v.slice(6)] || "#888";
        throw new Error(`unknown '${node.v}'`);
      }
      case "un": {
        const a = this.run(node.a);
        if (node.op === "not") return this.mapU(a, x => (x ? 0 : 1));
        return this.mapU(a, x => -x);
      }
      case "bin": return this.binop(node.op, this.run(node.a), this.run(node.b));
      case "tern": {
        const c = this.run(node.c);
        if (isSeries(c)) {
          const av = this.toArr(this.run(node.a)), bv = this.toArr(this.run(node.b)), cv = c.v;
          const o = new Float64Array(this.n); for (let i = 0; i < this.n; i++) o[i] = cv[i] ? av[i] : bv[i];
          return mkSeries(o);
        }
        return this.num(c) ? this.run(node.a) : this.run(node.b);
      }
      case "index": {
        const a = this.run(node.a); const k = Math.round(this.num(this.run(node.i)));
        return mkSeries(shift(this.toArr(a), k));
      }
      case "call": return this.call(node);
    }
  }

  private mapU(a: Val, f: (x: number) => number): Val {
    if (isSeries(a)) { const o = new Float64Array(this.n); for (let i = 0; i < this.n; i++) o[i] = f(a.v[i]); return mkSeries(o); }
    return f(this.num(a));
  }
  private binop(op: string, a: Val, b: Val): Val {
    const f = BIN[op]; if (!f) throw new Error(`bad op ${op}`);
    if (isSeries(a) || isSeries(b)) {
      const av = this.toArr(a), bv = this.toArr(b), o = new Float64Array(this.n);
      for (let i = 0; i < this.n; i++) o[i] = f(av[i], bv[i]);
      return mkSeries(o);
    }
    return f(this.num(a), this.num(b));
  }

  private call(node: Extract<Node, { n: "call" }>): Val {
    const A = node.args.map(x => this.run(x));
    const kw = (k: string) => (node.kw[k] !== undefined ? this.run(node.kw[k]) : undefined);
    const name = node.name;

    if (name === "indicator") {
      if (typeof A[0] === "string") this.title = A[0];
      const ov = kw("overlay") ?? A[2]; if (ov !== undefined) this.overlay = !!this.num(ov as Val);
      return null;
    }
    if (name === "plot") {
      const vals = this.toArr(A[0]);
      const color = (kw("color") ?? A[2] ?? this.palette[this.colorIdx++ % this.palette.length]) as string;
      const width = this.num((kw("linewidth") ?? A[3] ?? 1) as Val) || 1;
      const title = (kw("title") ?? A[1] ?? `plot${this.out.length}`) as string;
      this.out.push({ title: String(title), color: String(color), width, kind: "line", values: arr2null(vals) });
      return null;
    }
    if (name === "hline") {
      const price = this.num(A[0]);
      const color = (kw("color") ?? A[2] ?? "#7d848c") as string;
      const title = (kw("title") ?? A[1] ?? "hline") as string;
      this.out.push({ title: String(title), color: String(color), width: 1, kind: "hline", values: [], price });
      return null;
    }
    if (name === "color.new") return A[0];
    if (name.startsWith("input")) return A[0] ?? 0;
    if (name === "nz") { const v = this.toArr(A[0]); const o = new Float64Array(this.n); for (let i = 0; i < this.n; i++) o[i] = isNaN(v[i]) ? this.num(A[1] ?? 0) : v[i]; return mkSeries(o); }
    if (name === "na") return isNaN(this.num(A[0])) ? true : false;

    const fn = BUILTIN[name];
    if (fn) return fn(A, this);
    throw new Error(`unknown function '${name}'`);
  }

  assign(name: string, v: Val) { this.env.set(name, v); }
}

const BIN: Record<string, (a: number, b: number) => number> = {
  "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b, "/": (a, b) => a / b, "%": (a, b) => a % b,
  "==": (a, b) => (a === b ? 1 : 0), "!=": (a, b) => (a !== b ? 1 : 0),
  "<": (a, b) => (a < b ? 1 : 0), ">": (a, b) => (a > b ? 1 : 0),
  "<=": (a, b) => (a <= b ? 1 : 0), ">=": (a, b) => (a >= b ? 1 : 0),
  "and": (a, b) => (a && b ? 1 : 0), "or": (a, b) => (a || b ? 1 : 0),
};

const COLORS: Record<string, string> = {
  red: "#e0524b", green: "#26a65b", blue: "#2196f3", orange: "#ff9e00", yellow: "#ffd54f",
  purple: "#ab47bc", fuchsia: "#e040fb", teal: "#26a69a", white: "#d6d9dc", gray: "#7d848c",
  black: "#000000", lime: "#c6ff00", maroon: "#8d3b3b", navy: "#3949ab", aqua: "#00bcd4", silver: "#bdbdbd",
};

const arr2null = (a: Float64Array): (number | null)[] => Array.from(a, x => (isNaN(x) ? null : x));
const ZEROARG = new Set<string>(["ta.vwap"]);

type BFn = (A: Val[], I: Interp) => Val;
const S = (I: Interp, v: Val) => I.toArr(v);
const num = (I: Interp, v: Val) => (typeof v === "number" ? v : Math.round((I.toArr(v))[I.toArr(v).length - 1]));

const BUILTIN: Record<string, BFn> = {
  "ta.sma": (A, I) => mkSeries(rollingSMA(S(I, A[0]), num(I, A[1]))),
  "ta.ema": (A, I) => mkSeries(ema(S(I, A[0]), num(I, A[1]))),
  "ta.rma": (A, I) => mkSeries(rma(S(I, A[0]), num(I, A[1]))),
  "ta.wma": (A, I) => mkSeries(wma(S(I, A[0]), num(I, A[1]))),
  "ta.vwma": (A, I) => { const src = S(I, A[0]), vol = S(I, I.env.get("volume")!), len = num(I, A[1]);
    const pv = new Float64Array(src.length); for (let i = 0; i < src.length; i++) pv[i] = src[i] * vol[i];
    const a = rollingSMA(pv, len), b = rollingSMA(vol, len), o = new Float64Array(src.length);
    for (let i = 0; i < src.length; i++) o[i] = a[i] / b[i]; return mkSeries(o); },
  "ta.stdev": (A, I) => mkSeries(rollingStd(S(I, A[0]), num(I, A[1]))),
  "ta.dev": (A, I) => mkSeries(rollingStd(S(I, A[0]), num(I, A[1]))),
  "ta.variance": (A, I) => { const s = rollingStd(S(I, A[0]), num(I, A[1])); return mkSeries(s.map(x => x * x) as Float64Array); },
  "ta.change": (A, I) => mkSeries(A[1] ? shiftDiff(S(I, A[0]), num(I, A[1])) : change(S(I, A[0]))),
  "ta.mom": (A, I) => mkSeries(shiftDiff(S(I, A[0]), num(I, A[1]))),
  "ta.roc": (A, I) => { const x = S(I, A[0]), len = num(I, A[1]), o = new Float64Array(x.length).fill(NA);
    for (let i = len; i < x.length; i++) o[i] = (x[i] - x[i - len]) / x[i - len] * 100; return mkSeries(o); },
  "ta.highest": (A, I) => mkSeries(extreme(S(I, A[0]), num(I, A[1]), true)),
  "ta.lowest": (A, I) => mkSeries(extreme(S(I, A[0]), num(I, A[1]), false)),
  "ta.tr": (_, I) => mkSeries(trueRange(I)),
  "ta.atr": (A, I) => mkSeries(rma(trueRange(I), num(I, A[0]))),
  "ta.rsi": (A, I) => mkSeries(rsi(S(I, A[0]), num(I, A[1]))),
  "ta.vwap": (_, I) => mkSeries(vwap(I)),
  "ta.crossover": (A, I) => mkSeries(cross(S(I, A[0]), S(I, A[1]), "over")),
  "ta.crossunder": (A, I) => mkSeries(cross(S(I, A[0]), S(I, A[1]), "under")),
  "ta.cross": (A, I) => mkSeries(cross(S(I, A[0]), S(I, A[1]), "any")),
  "ta.median": (A, I) => { const x = S(I, A[0]), len = num(I, A[1]), o = new Float64Array(x.length).fill(NA);
    for (let i = len - 1; i < x.length; i++) { const w = Array.from(x.slice(i - len + 1, i + 1)).sort((p, q) => p - q); o[i] = w[Math.floor(len / 2)]; } return mkSeries(o); },
  "ta.macd": (A, I) => { const src = S(I, A[0]); const fast = ema(src, num(I, A[1])), slow = ema(src, num(I, A[2]));
    const macd = new Float64Array(src.length); for (let i = 0; i < src.length; i++) macd[i] = fast[i] - slow[i];
    const sig = ema(macd, num(I, A[3])); const hist = new Float64Array(src.length);
    for (let i = 0; i < src.length; i++) hist[i] = macd[i] - sig[i];
    return { t: true, items: [mkSeries(macd), mkSeries(sig), mkSeries(hist)] } as Tuple; },
  "math.abs": (A, I) => mapNum(I, A[0], Math.abs),
  "math.sqrt": (A, I) => mapNum(I, A[0], Math.sqrt),
  "math.exp": (A, I) => mapNum(I, A[0], Math.exp),
  "math.log": (A, I) => mapNum(I, A[0], Math.log),
  "math.log10": (A, I) => mapNum(I, A[0], Math.log10),
  "math.floor": (A, I) => mapNum(I, A[0], Math.floor),
  "math.ceil": (A, I) => mapNum(I, A[0], Math.ceil),
  "math.round": (A, I) => mapNum(I, A[0], Math.round),
  "math.sign": (A, I) => mapNum(I, A[0], Math.sign),
  "math.sin": (A, I) => mapNum(I, A[0], Math.sin),
  "math.cos": (A, I) => mapNum(I, A[0], Math.cos),
  "math.pow": (A, I) => mapNum2(I, A[0], A[1], Math.pow),
  "math.max": (A, I) => mapNum2(I, A[0], A[1], Math.max),
  "math.min": (A, I) => mapNum2(I, A[0], A[1], Math.min),
  "math.avg": (A, I) => mapNum2(I, A[0], A[1], (a, b) => (a + b) / 2),
};

function mapNum(I: Interp, v: Val, f: (x: number) => number): Val {
  const a = I.toArr(v), o = new Float64Array(a.length); for (let i = 0; i < a.length; i++) o[i] = f(a[i]); return mkSeries(o);
}
function mapNum2(I: Interp, a: Val, b: Val, f: (x: number, y: number) => number): Val {
  const av = I.toArr(a), bv = I.toArr(b), o = new Float64Array(av.length);
  for (let i = 0; i < av.length; i++) o[i] = f(av[i], bv[i]); return mkSeries(o);
}
function shiftDiff(x: Float64Array, n: number): Float64Array {
  const o = new Float64Array(x.length).fill(NA); for (let i = n; i < x.length; i++) o[i] = x[i] - x[i - n]; return o;
}
function trueRange(I: Interp): Float64Array {
  const h = I.toArr(I.env.get("high")!), l = I.toArr(I.env.get("low")!), c = I.toArr(I.env.get("close")!);
  const o = new Float64Array(h.length);
  for (let i = 0; i < h.length; i++) { const pc = i ? c[i - 1] : c[i]; o[i] = Math.max(h[i] - l[i], Math.abs(h[i] - pc), Math.abs(l[i] - pc)); }
  return o;
}
function rsi(x: Float64Array, len: number): Float64Array {
  const up = new Float64Array(x.length).fill(NA), dn = new Float64Array(x.length).fill(NA);
  for (let i = 1; i < x.length; i++) { const d = x[i] - x[i - 1]; up[i] = Math.max(d, 0); dn[i] = Math.max(-d, 0); }
  const ru = rma(up, len), rd = rma(dn, len), o = new Float64Array(x.length).fill(NA);
  for (let i = 0; i < x.length; i++) { if (isNaN(ru[i])) continue; const rs = ru[i] / rd[i]; o[i] = rd[i] === 0 ? 100 : 100 - 100 / (1 + rs); }
  return o;
}
function vwap(I: Interp): Float64Array {
  const p = I.toArr(I.env.get("hlc3")!), v = I.toArr(I.env.get("volume")!), o = new Float64Array(p.length);
  let cpv = 0, cv = 0; for (let i = 0; i < p.length; i++) { cpv += p[i] * v[i]; cv += v[i]; o[i] = cv ? cpv / cv : NA; } return o;
}
function cross(a: Float64Array, b: Float64Array, dir: "over" | "under" | "any"): Float64Array {
  const o = new Float64Array(a.length).fill(0);
  for (let i = 1; i < a.length; i++) {
    const over = a[i - 1] <= b[i - 1] && a[i] > b[i], under = a[i - 1] >= b[i - 1] && a[i] < b[i];
    o[i] = (dir === "over" ? over : dir === "under" ? under : over || under) ? 1 : 0;
  }
  return o;
}

const ADVANCED = /(^|\n)\s*(var|varip)\s+|(^|\n)\s*for\s+|(^|\n)\s*while\s+|(^|\n)\s*if\s+|plotshape|plotchar/;

export function runPine(src: string, bars: Bar[]): PineResult {
  return ADVANCED.test(src) ? runBar(src, bars) : runVector(src, bars);
}

function runVector(src: string, bars: Bar[]): PineResult {
  const I = new Interp(bars);
  const errors: string[] = [];
  const lines = src.split(/\r?\n/);
  lines.forEach((raw, ln) => {
    const line = stripComment(raw).trim();
    if (!line || line.startsWith("//")) return;
    try {
      const toks = tokenize(line);
      if (!toks.length) return;
      if (toks[0].v === "[") {
        const close = toks.findIndex(t => t.v === "]");
        const names = toks.slice(1, close).filter(t => t.k === "id").map(t => t.v);
        const rhs = new Parser(toks.slice(close + 2)).parseExpr();
        const val = I.run(rhs);
        if (isTuple(val)) names.forEach((nm, i) => I.assign(nm, val.items[i] ?? null));
        return;
      }
      if (toks[0].k === "id" && (toks[1]?.v === "=" || toks[1]?.v === ":=")) {
        const rhs = new Parser(toks.slice(2)).parseExpr();
        I.assign(toks[0].v, I.run(rhs));
        return;
      }
      I.run(new Parser(toks).parseExpr());
    } catch (e: any) {
      errors.push(`line ${ln + 1}: ${e.message}`);
    }
  });
  return { title: I.title, overlay: I.overlay, plots: I.out, errors };
}

function stripComment(line: string): string {
  let inStr: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inStr) { if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'") inStr = c;
    else if (c === "/" && line[i + 1] === "/") return line.slice(0, i);
  }
  return line;
}

type SV = number | string | boolean;

type Stmt =
  | { s: "expr"; e: Node }
  | { s: "assign"; kind: "=" | ":=" | "var"; name: string; e: Node }
  | { s: "tuple"; names: string[]; e: Node }
  | { s: "if"; cond: Node; body: Stmt[]; els: Stmt[] | null }
  | { s: "for"; v: string; from: Node; to: Node; step: Node | null; body: Stmt[] }
  | { s: "while"; cond: Node; body: Stmt[] };

function indentOf(raw: string): number {
  let n = 0; for (const c of raw) { if (c === " ") n++; else if (c === "\t") n += 4; else break; } return n;
}

function parseProgram(src: string): { prog: Stmt[]; errors: string[] } {
  const errors: string[] = [];
  const lines = src.split(/\r?\n/)
    .map((raw, i) => ({ indent: indentOf(raw), text: stripComment(raw).trim(), no: i + 1 }))
    .filter(l => l.text.length && !l.text.startsWith("//"));
  let pos = 0;
  const expr = (toks: Tok[]) => new Parser(toks).parseExpr();

  function childIndent(headerIndent: number): number {
    return pos < lines.length && lines[pos].indent > headerIndent ? lines[pos].indent : headerIndent + 1;
  }
  function block(minIndent: number): Stmt[] {
    const out: Stmt[] = [];
    while (pos < lines.length && lines[pos].indent >= minIndent) {
      const before = pos;
      try { out.push(stmt()); } catch (e: any) { errors.push(`line ${lines[before]?.no}: ${e.message}`); if (pos === before) pos++; }
    }
    return out;
  }
  function stmt(): Stmt {
    const ln = lines[pos]; const toks = tokenize(ln.text); const head = toks[0]?.v;
    if (head === "if") { pos++; const cond = expr(toks.slice(1)); const body = block(childIndent(ln.indent));
      let els: Stmt[] | null = null;
      if (pos < lines.length && lines[pos].indent === ln.indent && tokenize(lines[pos].text)[0]?.v === "else") {
        const e = lines[pos]; pos++; els = block(childIndent(e.indent));
      }
      return { s: "if", cond, body, els };
    }
    if (head === "for") {
      pos++; const v = toks[1].v;
      const ti = toks.findIndex(x => x.k === "id" && x.v === "to");
      const bi = toks.findIndex(x => x.k === "id" && x.v === "by");
      const from = expr(toks.slice(3, ti));
      const to = expr(toks.slice(ti + 1, bi >= 0 ? bi : undefined));
      const step = bi >= 0 ? expr(toks.slice(bi + 1)) : null;
      return { s: "for", v, from, to, step, body: block(childIndent(ln.indent)) };
    }
    if (head === "while") { pos++; return { s: "while", cond: expr(toks.slice(1)), body: block(childIndent(ln.indent)) }; }
    if (head === "var" || head === "varip") { pos++; return { s: "assign", kind: "var", name: toks[1].v, e: expr(toks.slice(3)) }; }
    if (toks[0]?.v === "[") {
      pos++; const close = toks.findIndex(x => x.v === "]");
      const names = toks.slice(1, close).filter(x => x.k === "id").map(x => x.v);
      return { s: "tuple", names, e: expr(toks.slice(close + 2)) };
    }
    if (toks[0]?.k === "id" && (toks[1]?.v === "=" || toks[1]?.v === ":=")) {
      pos++; return { s: "assign", kind: toks[1].v as "=" | ":=", name: toks[0].v, e: expr(toks.slice(2)) };
    }
    pos++; return { s: "expr", e: expr(toks) };
  }
  const prog = block(0);
  return { prog, errors };
}

class BarExec {
  private n: number;
  private arr: Record<string, Float64Array> = {};
  private env = new Map<string, SV>();
  private hist = new Map<string, number[]>();
  private varInit = new Set<string>();
  out: PinePlot[] = [];
  title = "Indicator"; overlay = false; errors: string[] = [];
  private vI: Interp; private vCache = new Map<Node, Float64Array>();
  private vTuple = new Map<Node, Float64Array[]>();
  private palette = ["#2196f3", "#ff9e00", "#26a65b", "#e0524b", "#ab47bc", "#00bcd4"];
  private colorIdx = 0; private seq = 0;

  constructor(private bars: Bar[]) {
    this.n = bars.length;
    const mk = (f: (b: Bar) => number) => { const a = new Float64Array(this.n); for (let i = 0; i < this.n; i++) a[i] = f(bars[i]); return a; };
    this.arr.open = mk(b => b.open); this.arr.high = mk(b => b.high); this.arr.low = mk(b => b.low);
    this.arr.close = mk(b => b.close); this.arr.volume = mk(b => b.volume);
    this.arr.hl2 = mk(b => (b.high + b.low) / 2); this.arr.hlc3 = mk(b => (b.high + b.low + b.close) / 3);
    this.arr.ohlc4 = mk(b => (b.open + b.high + b.low + b.close) / 4);
    this.arr.bar_index = mk(() => 0); for (let i = 0; i < this.n; i++) this.arr.bar_index[i] = i;
    this.vI = new Interp(bars);
  }

  run(prog: Stmt[]): PineResult {
    for (let t = 0; t < this.n; t++) {
      this.seq = 0;
      this.execAll(prog, t);
      for (const [k, v] of this.env) if (typeof v === "number") { const h = this.hist.get(k) || []; h.push(v); this.hist.set(k, h); }
    }
    return { title: this.title, overlay: this.overlay, plots: this.out, errors: this.errors };
  }

  private num(v: SV): number { return typeof v === "number" ? v : typeof v === "boolean" ? (v ? 1 : 0) : NaN; }
  private truthy(v: SV): boolean { const x = this.num(v); return !isNaN(x) && x !== 0; }

  private vSeries(node: Node): Float64Array {
    let c = this.vCache.get(node);
    if (c) return c;
    c = this.vI.toArr(this.vI.run(node) as any); this.vCache.set(node, c); return c;
  }
  private vTupleOf(node: Node): Float64Array[] {
    const cached = this.vTuple.get(node); if (cached) return cached;
    const r = this.vI.run(node) as any;
    const arrs: Float64Array[] = (r && r.t ? r.items : []).map((x: any) => this.vI.toArr(x));
    this.vTuple.set(node, arrs); return arrs;
  }
  private vRegister(name: string, node: Node) {
    try { this.vI.env.set(name, this.vI.run(node)); } catch { }
  }

  private evalS(node: Node, t: number): SV {
    switch (node.n) {
      case "num": return node.v;
      case "str": return node.v;
      case "id": {
        const nm = node.v;
        if (this.arr[nm]) return this.arr[nm][t];
        if (this.env.has(nm)) return this.env.get(nm)!;
        if (nm === "na") return NaN;
        if (nm === "true") return true; if (nm === "false") return false;
        if (nm.startsWith("color.")) return COLORS[nm.slice(6)] || "#888";
        if (nm === "ta.vwap") return this.vSeries(node)[t];
        if (nm.includes(".")) return nm;
        throw new Error(`unknown '${nm}'`);
      }
      case "un": { const a = this.num(this.evalS(node.a, t)); return node.op === "not" ? (a ? 0 : 1) : -a; }
      case "bin": { const f = BIN[node.op]; return f(this.num(this.evalS(node.a, t)), this.num(this.evalS(node.b, t))); }
      case "tern": return this.truthy(this.evalS(node.c, t)) ? this.evalS(node.a, t) : this.evalS(node.b, t);
      case "index": {
        const k = Math.round(this.num(this.evalS(node.i, t)));
        if (node.a.n === "id") {
          const nm = node.a.v;
          if (this.arr[nm]) return t - k >= 0 ? this.arr[nm][t - k] : NaN;
          if (k === 0) return this.env.get(nm) ?? NaN;
          const h = this.hist.get(nm); return h && h.length - k >= 0 ? h[h.length - k] : NaN;
        }
        if (node.a.n === "call") { const s = this.vSeries(node.a); return t - k >= 0 ? s[t - k] : NaN; }
        throw new Error("history [n] only on variables or ta.* calls");
      }
      case "call": return this.callS(node, t);
    }
  }

  private strOf(n: Node | undefined, t: number): string | undefined { return n ? String(this.evalS(n, t)) : undefined; }
  private numOf(n: Node | undefined, t: number): number | undefined { return n ? this.num(this.evalS(n, t)) : undefined; }

  private callS(node: Extract<Node, { n: "call" }>, t: number): SV {
    const name = node.name, kw = node.kw, args = node.args;
    if (name === "indicator") { if (t === 0) { if (args[0]?.n === "str") this.title = args[0].v; const ov = kw.overlay ?? args[2]; if (ov) this.overlay = this.truthy(this.evalS(ov, t)); } return 0; }
    if (name === "plot") {
      const slot = this.seq++, val = this.num(this.evalS(args[0], t));
      if (!this.out[slot]) this.out[slot] = { title: this.strOf(kw.title ?? args[1], t) || `plot${slot}`, color: this.strOf(kw.color ?? args[2], t) || this.palette[this.colorIdx++ % this.palette.length], width: this.numOf(kw.linewidth ?? args[3], t) || 1, kind: "line", values: Array(t).fill(null) };
      this.out[slot].values.push(isNaN(val) ? null : val); return 0;
    }
    if (name === "plotshape" || name === "plotchar") {
      const slot = this.seq++, on = this.truthy(this.evalS(args[0], t));
      const locStr = this.strOf(kw.location, t) || "";
      const above = !/below/i.test(locStr);
      if (!this.out[slot]) this.out[slot] = { title: this.strOf(kw.title ?? args[1], t) || `shape${slot}`, color: this.strOf(kw.color, t) || "#4a9fd4", width: 1, kind: "shape", values: Array(t).fill(null), above };
      this.out[slot].values.push(on ? (above ? this.arr.high[t] : this.arr.low[t]) : null); return 0;
    }
    if (name === "hline") { if (t === 0) this.out.push({ title: this.strOf(kw.title ?? args[1], t) || "hline", color: this.strOf(kw.color ?? args[2], t) || "#7d848c", width: 1, kind: "hline", values: [], price: this.num(this.evalS(args[0], t)) }); return 0; }
    if (name === "color.new") return this.evalS(args[0], t);
    if (name.startsWith("input")) return args[0] ? this.evalS(args[0], t) : 0;
    if (name === "nz") { const v = this.num(this.evalS(args[0], t)); return isNaN(v) ? (args[1] ? this.num(this.evalS(args[1], t)) : 0) : v; }
    if (name === "na") return isNaN(this.num(this.evalS(args[0], t))) ? true : false;
    if (name.startsWith("ta.") || name.startsWith("math.")) return this.vSeries(node)[t];
    throw new Error(`unknown function '${name}'`);
  }

  private execAll(stmts: Stmt[], t: number) { for (const s of stmts) this.execOne(s, t); }
  private execOne(st: Stmt, t: number) {
    switch (st.s) {
      case "expr": this.evalS(st.e, t); return;
      case "assign":
        if (st.kind === "var") { if (!this.varInit.has(st.name)) { this.env.set(st.name, this.evalS(st.e, t)); this.varInit.add(st.name); if (t === 0) this.vRegister(st.name, st.e); } }
        else { this.env.set(st.name, this.evalS(st.e, t)); if (t === 0) this.vRegister(st.name, st.e); }
        return;
      case "tuple": {
        const items = this.vTupleOf(st.e);
        st.names.forEach((nm, k) => { this.env.set(nm, items[k] ? items[k][t] : NaN); if (t === 0 && items[k]) this.vI.env.set(nm, { s: true, v: items[k] } as any); });
        return;
      }
      case "if": if (this.truthy(this.evalS(st.cond, t))) this.execAll(st.body, t); else if (st.els) this.execAll(st.els, t); return;
      case "for": {
        const from = this.num(this.evalS(st.from, t)), to = this.num(this.evalS(st.to, t));
        const step = st.step ? this.num(this.evalS(st.step, t)) : 1;
        let guard = 0;
        for (let i = from; step > 0 ? i <= to : i >= to; i += step) { if (guard++ > 100000) break; this.env.set(st.v, i); this.execAll(st.body, t); }
        return;
      }
      case "while": { let guard = 0; while (this.truthy(this.evalS(st.cond, t)) && guard++ < 100000) this.execAll(st.body, t); return; }
    }
  }
}

function runBar(src: string, bars: Bar[]): PineResult {
  const { prog, errors } = parseProgram(src);
  const ex = new BarExec(bars);
  ex.errors.push(...errors);
  try { return ex.run(prog); }
  catch (e: any) { return { title: ex.title, overlay: ex.overlay, plots: ex.out, errors: [...ex.errors, String(e.message || e)] }; }
}
