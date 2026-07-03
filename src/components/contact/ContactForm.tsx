import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import FloatingField, { type Field } from '../ui/FloatingField'
import { easing } from '../../constans/animation'

const FIELDS: Field[] = [
    { id: 'name', label: 'Your name', type: 'text' },
    { id: 'email', label: 'Email address', type: 'email' },
    { id: 'subject', label: 'Subject', type: 'text' },
    { id: 'message', label: 'Message', type: 'text', isTextarea: true },
]

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false)
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3200)
    }

    const spawnRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const id = Date.now()
        setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
        setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
            viewport={{ once: true, margin: '-80px' }}
            className="form-card rounded-3xl p-6 sm:p-8 md:p-10"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {FIELDS.map((field, i) => (
                    <FloatingField key={field.id} field={field} index={i} />
                ))}

                <motion.button
                    type="submit"
                    onClick={spawnRipple}
                    whileTap={{ scale: 0.97 }}
                    className="submit-btn relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-[#EAF1EC]"
                >
                    {/* Ripple Effect */}
                    {ripples.map((r) => (
                        <motion.span
                            key={r.id}
                            className="pointer-events-none absolute rounded-full bg-white/35"
                            style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
                            initial={{ width: 0, height: 0, opacity: 0.6 }}
                            animate={{ width: 340, height: 340, opacity: 0 }}
                            transition={{ duration: 0.65, ease: 'easeOut' }}
                        />
                    ))}

                    {/* Shine Sweep on hover */}
                    <span className="shine-sweep pointer-events-none absolute inset-0" />

                    <span className="relative z-10">
                        {submitted ? 'Message sent' : 'Send message'}
                    </span>
                    <Send className="relative z-10 h-3.5 w-3.5" />
                </motion.button>
            </form>

            <style>{`
        .form-card {
          background: rgba(184, 206, 194, 0.92);
          border: 1px solid rgba(184, 206, 194, 1);
          box-shadow: 0 20px 55px -20px rgba(18, 33, 36, 0.35);
        }
        .form-field {
          background: rgba(18, 33, 36, 0.06);
          border: 1px solid rgba(36, 65, 71, 0.18);
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .form-field:focus {
          border-color: rgba(36, 65, 71, 0.55);
          background: rgba(18, 33, 36, 0.1);
        }
        .submit-btn {
          background: #244147;
          transition: transform 0.3s ease;
        }
        .submit-btn:hover { transform: translateY(-1px); }
        .shine-sweep {
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%);
          transform: translateX(-120%);
          transition: transform 0.7s ease;
        }
        .submit-btn:hover .shine-sweep { transform: translateX(120%); }
      `}</style>
        </motion.div>
    )
}