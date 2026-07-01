import { type Transition } from 'framer-motion'

export const easing: [number, number, number, number] = [
    0.25,
    0.1,
    0.25,
    1,
]

export const viewTransition: Transition = {
    duration: 1,
    ease: easing,
}

export const viewMotion = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: viewTransition,
    viewport: {
        once: true,
        margin: '-100px',
    },
}