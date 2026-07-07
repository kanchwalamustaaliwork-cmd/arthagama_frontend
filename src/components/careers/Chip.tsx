import { motion } from 'framer-motion'

export default function Chip({
    label,
    active,
    onClick,
}: {
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <motion.button
            onClick={onClick}
            // Scale + Fade on selection change
            animate={{ scale: active ? 1.04 : 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className={`chip whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors duration-300 ${active ? 'chip-active' : 'chip-inactive'
                }`}
        >
            {label}
        </motion.button>
    )
}