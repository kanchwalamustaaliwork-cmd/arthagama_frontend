
const MAX_PEEK_DEPTH = 3 // how many stacked layers peek out behind the front card
const EXIT_Y = -150 // px the front card travels as it leaves
const EXIT_ROTATE = -5 // deg the front card rotates as it leaves

/**
 * Pure function: given a continuous "scroll position" (v) and a card's own
 * index, return that card's visual state.
 *
 *  v < index          -> card is still waiting in the stack (peeking behind)
 *  index <= v < i + 1  -> card is the active, front card and is mid-exit
 *  v >= index + 1      -> card has fully left
 */
export default function CardState(v: number, index: number) {
    if (v >= index + 1) {
        return { y: EXIT_Y, opacity: 0, scale: 0.92, rotate: EXIT_ROTATE }
    }
    if (v >= index) {
        const f = v - index
        return {
            y: f * EXIT_Y,
            opacity: 1 - f,
            scale: 1 - f * 0.08,
            rotate: f * EXIT_ROTATE,
        }
    }
    const depth = Math.min(index - v, MAX_PEEK_DEPTH)
    return {
        y: depth * 14,
        opacity: depth >= MAX_PEEK_DEPTH ? 0 : 1,
        scale: 1 - depth * 0.045,
        rotate: 0,
    }
}