// Starter Pine-style scripts for the indicator editor.
export const EXAMPLES: { name: string; src: string }[] = [
  {
    name: "EMA Ribbon",
    src: `//@version=5
indicator("EMA Ribbon", overlay=true)
plot(ta.ema(close, 9),  "EMA 9",  color.orange)
plot(ta.ema(close, 21), "EMA 21", color.blue)
plot(ta.ema(close, 50), "EMA 50", color.purple)`,
  },
  {
    name: "Bollinger Bands",
    src: `//@version=5
indicator("Bollinger Bands", overlay=true)
len = input.int(20, "Length")
mult = input.float(2.0, "Mult")
basis = ta.sma(close, len)
dev = mult * ta.stdev(close, len)
plot(basis, "Basis", color.orange)
plot(basis + dev, "Upper", color.green)
plot(basis - dev, "Lower", color.red)`,
  },
  {
    name: "RSI",
    src: `//@version=5
indicator("RSI", overlay=false)
len = input.int(14, "Length")
r = ta.rsi(close, len)
plot(r, "RSI", color.blue, 2)
hline(70, "Overbought", color.red)
hline(30, "Oversold", color.green)`,
  },
  {
    name: "MACD",
    src: `//@version=5
indicator("MACD", overlay=false)
[macdLine, signalLine, hist] = ta.macd(close, 12, 26, 9)
plot(hist, "Histogram", color.gray, 3)
plot(macdLine, "MACD", color.blue, 2)
plot(signalLine, "Signal", color.orange, 2)
hline(0, "Zero", color.gray)`,
  },
  {
    name: "VWAP + ATR bands",
    src: `//@version=5
indicator("VWAP", overlay=true)
v = ta.vwap
a = ta.atr(14)
plot(v, "VWAP", color.orange, 2)
plot(v + a, "VWAP+ATR", color.green)
plot(v - a, "VWAP-ATR", color.red)`,
  },
  {
    name: "EMA Cross signals (var/plotshape)",
    src: `//@version=5
indicator("EMA Cross", overlay=true)
fast = ta.ema(close, 9)
slow = ta.ema(close, 21)
plot(fast, "Fast", color.orange)
plot(slow, "Slow", color.blue)
plotshape(ta.crossover(fast, slow),  title="Buy",  location=location.belowbar, color=color.green)
plotshape(ta.crossunder(fast, slow), title="Sell", location=location.abovebar, color=color.red)`,
  },
  {
    name: "Running count (var + for)",
    src: `//@version=5
indicator("Up-streak", overlay=false)
var streak = 0.0
if close > close[1]
    streak := streak + 1
else
    streak := 0
plot(streak, "Up bars in a row", color.teal, 2)`,
  },
  {
    name: "Supertrend-ish (ATR channel)",
    src: `//@version=5
indicator("ATR Channel", overlay=true)
mult = input.float(3.0, "Mult")
a = ta.atr(10)
mid = ta.ema(close, 20)
plot(mid, "Mid", color.gray)
plot(mid + mult * a, "Upper", color.red, 2)
plot(mid - mult * a, "Lower", color.green, 2)`,
  },
];
