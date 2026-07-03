import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import type { ApplicationPayload, ApplicationFormProps } from '../../types/careers'
import { submitApplication } from '../../services/careersApi'

const FIELD_CLASS =
    'form-field w-full rounded-full px-4 py-3 text-sm text-[#1B3236] outline-none placeholder:text-[#244147]/40'

export default function ApplicationForm({ jobId }: ApplicationFormProps) {
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        experienceYears: '',
        expectedSalary: '',
        resumeLink: '',
        note: '',
    })
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const [shake, setShake] = useState(false)

    const update = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((v) => ({ ...v, [key]: e.target.value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!values.name || !values.email || !values.resumeLink) {
            setErrorMsg('Please fill in your name, email, and resume link.')
            setStatus('error')
            setShake(true)
            setTimeout(() => setShake(false), 500)
            return
        }

        setStatus('submitting')
        const payload: ApplicationPayload = { jobId, ...values }

        try {
            await submitApplication(payload)
            setStatus('success')
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
            setStatus('error')
            setShake(true)
            setTimeout(() => setShake(false), 500)
        }
    }

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-10 text-center"
            >
                {/* Checkmark Morph — circle draws, then check draws */}
                <svg viewBox="0 0 52 52" className="h-14 w-14">
                    <motion.circle
                        cx="26" cy="26" r="24"
                        fill="none" stroke="#244147" strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                    <motion.path
                        d="M15 27l7 7 15-15" fill="none" stroke="#244147" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.45 }}
                    />
                </svg>
                <p className="text-sm font-medium text-[#1B3236]">Application received</p>
                <p className="max-w-xs text-xs text-[#244147]/70">
                    We'll review your profile and reach out if there's a fit. Thanks for applying to Arthagama.
                </p>
            </motion.div>
        )
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required placeholder="Full name" value={values.name} onChange={update('name')} className={FIELD_CLASS} />
                <input required type="email" placeholder="Email address" value={values.email} onChange={update('email')} className={FIELD_CLASS} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input placeholder="Phone number" value={values.phone} onChange={update('phone')} className={FIELD_CLASS} />
                <input placeholder="Years of experience" value={values.experienceYears} onChange={update('experienceYears')} className={FIELD_CLASS} />
            </div>
            <input placeholder="Expected salary (annual, ₹)" value={values.expectedSalary} onChange={update('expectedSalary')} className={FIELD_CLASS} />

            <div>
                <input
                    required
                    placeholder="Resume link (Google Drive)"
                    value={values.resumeLink}
                    onChange={update('resumeLink')}
                    className={FIELD_CLASS}
                />
                <p className="mt-1.5 px-1 text-[11px] text-[#244147]/70">
                    Set your Drive file's sharing to "Anyone with the link" before pasting it here.
                </p>
            </div>

            <textarea
                placeholder="Anything else you'd like us to know? (optional)"
                rows={3}
                value={values.note}
                onChange={update('note')}
                className="form-field w-full resize-none rounded-2xl px-4 py-3 text-sm text-[#1B3236] outline-none placeholder:text-[#244147]/40"
            />

            <AnimatePresence>
                {status === 'error' && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-[#7a2d2d]"
                    >
                        {errorMsg}
                    </motion.p>
                )}
            </AnimatePresence>

            <motion.button
                type="submit"
                disabled={status === 'submitting'}
                whileTap={{ scale: 0.97 }}
                className="submit-btn mt-1 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-[#EAF1EC] disabled:opacity-70"
            >
                {status === 'submitting' ? 'Submitting...' : 'Submit application'}
                {status !== 'submitting' && <Send className="h-3.5 w-3.5" />}
            </motion.button>

            <style>{`
        .form-field {
          background: rgba(18, 33, 36, 0.06);
          border: 1px solid rgba(36, 65, 71, 0.18);
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .form-field:focus {
          border-color: rgba(36, 65, 71, 0.55);
          background: rgba(18, 33, 36, 0.1);
        }
        .submit-btn { background: #244147; transition: transform 0.3s ease; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); }
      `}</style>
        </motion.form>
    )
}