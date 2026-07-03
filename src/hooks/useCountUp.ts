import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

export function useCountUp(target: number, decimals = 0) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: '-100px' })
    const motionVal = useMotionValue(0)
    const spring = useSpring(motionVal, { stiffness: 50, damping: 18 })

    useEffect(() => {
        if (inView) motionVal.set(target)
    }, [inView, target, motionVal])

    useEffect(() => {
        return spring.on('change', (v) => {
            if (ref.current) ref.current.textContent = v.toFixed(decimals)
        })
    }, [spring, decimals])

    return ref
}