import { useState } from 'react'
import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'

export interface Field {
    id: 'name' | 'email' | 'subject' | 'message'
    label: string
    type: string
    isTextarea?: boolean
}

export default function FloatingField({ field, index }: { field: Field; index: number }) {
    const [value, setValue] = useState('')
    const [focused, setFocused] = useState(false)
    const active = focused || value.length > 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easing, delay: index * 0.08 }}
            viewport={{ once: true, margin: '-60px' }}
            className="relative"
        >
            <motion.label
                htmlFor={field.id}
                className="pointer-events-none absolute left-4 origin-left text-[#244147]/60"
                animate={
                    active
                        ? { top: 8, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' as const }
                        : { top: field.isTextarea ? 16 : '50%', y: field.isTextarea ? 0 : '-50%', fontSize: '14px' }
                }
                transition={{ duration: 0.25, ease: easing }}
            >
                {field.label}
            </motion.label>

            {field.isTextarea ? (
                <textarea
                    id={field.id}
                    rows={4}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="form-field w-full resize-none rounded-2xl px-4 pb-3 pt-6 text-sm text-[#1B3236] outline-none"
                />
            ) : (
                <input
                    id={field.id}
                    type={field.type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="form-field w-full rounded-full px-4 pb-2.5 pt-6 text-sm text-[#1B3236] outline-none"
                />
            )}
        </motion.div>
    )
}