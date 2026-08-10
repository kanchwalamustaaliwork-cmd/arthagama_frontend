/// <reference lib="webworker" />
/**
 * Pine indicator worker — runs the interpreter off the main thread so a heavy
 * or runaway script can never freeze the chart UI. Post {script, bars}; get a
 * PineResult back.
 */
import { runPine, Bar, PineResult } from "./pine";

self.onmessage = (e: MessageEvent<{ script: string; bars: Bar[] }>) => {
  const { script, bars } = e.data;
  let res: PineResult;
  try {
    res = runPine(script, bars);
  } catch (err: any) {
    res = { title: "", overlay: false, plots: [], errors: [String(err?.message || err)] };
  }
  (self as unknown as Worker).postMessage(res);
};
