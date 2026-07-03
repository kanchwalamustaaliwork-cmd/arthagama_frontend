import { motion, type Variants } from 'framer-motion'

const drawVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] },
    },
}

const sharedProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-6 w-6',
}

export function PhoneIcon() {
    return (
        <svg {...sharedProps}>
            <motion.path
                d="M4 5c0-.6.4-1 1-1h2.4c.5 0 .9.3 1 .8l.8 3.1c.1.4 0 .9-.4 1.2l-1.5 1.3a13.5 13.5 0 006.3 6.3l1.3-1.5c.3-.3.8-.5 1.2-.4l3.1.8c.5.1.8.5.8 1V19c0 .6-.4 1-1 1h-1C10 20 4 14 4 6.5V5z"
                variants={drawVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            />
        </svg>
    )
}

export function MailIcon() {
    return (
        <svg {...sharedProps}>
            <motion.rect
                x="3" y="5" width="18" height="14" rx="2"
                variants={drawVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            />
            <motion.path
                d="M4 6.5l8 6 8-6"
                variants={drawVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            />
        </svg>
    )
}

export function PinIcon() {
    return (
        <svg {...sharedProps}>
            <motion.path
                d="M12 21s7-6.3 7-11.5A7 7 0 105 9.5C5 14.7 12 21 12 21z"
                variants={drawVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            />
            <motion.circle
                cx="12" cy="9.5" r="2.3"
                variants={drawVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
        </svg>
    )
}