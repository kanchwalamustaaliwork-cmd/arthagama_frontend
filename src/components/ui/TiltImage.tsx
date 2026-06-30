

/* ────────────────────────────────────────────────────────────────────────
* TiltImage
 * A premium "alive" image element: tracks the cursor inside its own
 * bounding box and converts the pointer position into a 3D perspective
 * tilt (rotateX/rotateY) plus a faint translateZ "lift" so the corner
 * closest to the cursor reads as nearer to the viewer.
*
* - rotateX/rotateY are driven by springs (not raw values), so motion is
*   continuous, damped, and never snaps — satisfies "no sudden jumps".
* - On pointer leave, the springs simply relax back to 0, producing the
*   graceful return-to-resting-position automatically.
* - Only `transform` is animated (GPU-accelerated); no layout properties
*   are touched on every mouse move.
* ──────────────────────────────────────────────────────────────────────── */

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltImage({
    src,
    alt,
    className = '',
}: {
    src: string
    alt: string
    className?: string
}) {
    const ref = useRef<HTMLDivElement>(null)

    // Raw pointer position in [-0.5, 0.5] relative to the element's own box
    const pointerX = useMotionValue(0)
    const pointerY = useMotionValue(0)

    // Springs smooth every update — this is what makes the tilt feel fluid
    // and "alive" rather than locked rigidly to the cursor.
    const springConfig = { stiffness: 150, damping: 18, mass: 0.6 }
    const smoothX = useSpring(pointerX, springConfig)
    const smoothY = useSpring(pointerY, springConfig)

    // Map normalized pointer position to rotation degrees.
    // Moving toward the top-right (x>0, y<0) should lift that corner: a
    // positive x maps to a positive rotateY (right edge tilts toward viewer)
    // and a negative y maps to a positive rotateX (top edge tilts toward viewer).
    const MAX_TILT = 14 // degrees — kept subtle/premium, not gimmicky
    const rotateY = useTransform(smoothX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT])
    const rotateX = useTransform(smoothY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT])

    // Slight forward lift toward the viewer as tilt increases, reinforcing depth.
    const distance = useTransform([smoothX, smoothY], ([x, y]: number[]) =>
        Math.min(Math.hypot(x, y) * 2, 1)
    )
    const translateZ = useTransform(distance, [0, 1], [0, 18])

    // A soft directional highlight that follows the cursor, selling the
    // "glossy, dimensional surface" feel without any extra image assets.
    const glowX = useTransform(smoothX, [-0.5, 0.5], ['20%', '80%'])
    const glowY = useTransform(smoothY, [-0.5, 0.5], ['20%', '80%'])
    // const glowBackground = useTransform(
    //     [glowX, glowY],
    //     ([gx, gy]: string[]) =>
    //         `radial-gradient(circle at ${gx} ${gy}, hsl(var(--mint) / 0.25), transparent 60%)`
    // )

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width - 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5
        pointerX.set(px)
        pointerY.set(py)
    }

    const handlePointerLeave = () => {
        // Springs ease back to 0 on their own — no manual tween needed.
        pointerX.set(0)
        pointerY.set(0)
    }

    return (
        <div
            ref={ref}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className={`group relative select-none ${className}`}
            style={{ perspective: 900 }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    translateZ,
                    transformStyle: 'preserve-3d',
                }}
                className="relative will-change-transform"
            >
                <img
                    src={src}
                    alt={alt}
                    draggable={false}
                    className="pointer-events-none w-full select-none drop-shadow-[0_18px_40px_hsl(var(--teal-deep)/0.55)]"
                />

                {/* Cursor-tracking glossy highlight, reinforces the 3D surface feel
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                        // background: glowBackground,
                        mixBlendMode: 'screen',
                    }}
                /> */}
            </motion.div>
        </div>
    )
}