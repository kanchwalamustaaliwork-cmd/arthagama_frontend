import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, MapPin, Clock } from 'lucide-react'
import type { JobListing } from '../../types/careers'
import ApplicationForm from './ApplicationForm'
import { easing } from '../../constans/animation'

export default function JobDetailDrawer({ job, onClose }: { job: JobListing; onClose: () => void }) {
    // Lock the background page from scrolling while the drawer is open —
    // Lenis drives scroll off window-level wheel/touch events, so without
    // this the background can still scroll underneath the drawer even
    // though the drawer itself has overflow-y-auto.
    useEffect(() => {
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [])

    return (
        <div className="fixed inset-0 z-[70] flex justify-end">
            <motion.div
                className="scrim absolute inset-0"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            {/* data-lenis-prevent tells Lenis to skip hijacking scroll on this
          element — without it, Lenis intercepts the wheel/touch event at
          the window level and scrolls the page behind the drawer instead
          of the drawer's own overflow-y-auto content. */}
            <motion.div
                data-lenis-prevent
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.5, ease: easing }}
                className="drawer-panel relative z-10 flex h-full w-full max-w-xl flex-col overflow-y-auto overscroll-contain"
            >
                <button
                    onClick={onClose}
                    className="sticky top-5 z-10 ml-auto mr-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#122124]/60 text-[#EAF1EC] backdrop-blur-sm"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="px-6 pb-16 pt-2 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5, ease: easing }}
                    >
                        <span className="rounded-full bg-[#244147]/10 px-3 py-1 text-[11px] font-medium text-[#244147]">
                            {job.type === 'internship' ? 'Internship' : 'Full-time'}
                        </span>
                        <h2 className="mt-4 text-2xl font-body font-semibold text-[#1B3236] sm:text-3xl">
                            {job.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#244147]/65">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                Posted {job.postedDaysAgo} day{job.postedDaysAgo === 1 ? '' : 's'} ago
                            </span>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.5, ease: easing }}
                        className="mt-6 text-sm leading-relaxed text-[#244147]/85"
                    >
                        {job.summary}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.5, ease: easing }}
                        className="mt-8"
                    >
                        <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-[#244147]/55">Responsibilities</h3>
                        <ul className="flex flex-col gap-2">
                            {job.responsibilities.map((item) => (
                                <li key={item} className="flex gap-2 text-sm text-[#244147]/85">
                                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#244147]/50" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.34, duration: 0.5, ease: easing }}
                        className="mt-8"
                    >
                        <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-[#244147]/55">Requirements</h3>
                        <ul className="flex flex-col gap-2">
                            {job.requirements.map((item) => (
                                <li key={item} className="flex gap-2 text-sm text-[#244147]/85">
                                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#244147]/50" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5, ease: easing }}
                        className="mt-10 border-t border-[#244147]/12 pt-8"
                    >
                        <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-[#244147]/55">Apply for this role</h3>
                        <ApplicationForm jobId={job.id} />
                    </motion.div>
                </div>
            </motion.div>

            <style>{`
        .scrim {
          background: rgba(12, 22, 24, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .drawer-panel {
          background: rgba(184, 206, 194, 0.97);
          box-shadow: -30px 0 80px -20px rgba(0, 0, 0, 0.5);
        }
      `}</style>
        </div>
    )
}