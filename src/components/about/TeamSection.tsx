import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TEAM } from '../../data/team'
import TeamCard from './TeamCard'
import EmployeeProfile from './EmployeeProfile'

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

export default function TeamSection() {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const selectedMember = TEAM.find((m) => m.id === selectedId) ?? null

    return (
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-16">
            <div className="section-backing absolute inset-x-4 inset-y-6 -z-10 rounded-3xl sm:inset-x-6" />

            <div className="mx-auto max-w-[1200px]">
                <motion.div
                    className="mb-10 flex flex-col sm:mb-14"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easing }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <h2 className="text-3xl font-body font-light text-[#EAF1EC] sm:text-4xl md:text-5xl">
                        Meet the <em className="font-display italic text-[#EAF1EC]">team</em>
                    </h2>
                    <p className="mt-3 max-w-sm text-sm text-[#DCE7E1]/80">
                        A small, focused team spanning research, engineering, and risk.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {TEAM.map((member, i) => (
                        <TeamCard key={member.id} member={member} index={i} onSelect={() => setSelectedId(member.id)} />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedMember && (
                    <EmployeeProfile member={selectedMember} onClose={() => setSelectedId(null)} />
                )}
            </AnimatePresence>

            <style>{`
        .section-backing {
          background: rgba(18, 33, 36, 0.62);
          backdrop-filter: blur(28px) saturate(1.1);
          -webkit-backdrop-filter: blur(28px) saturate(1.1);
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(184, 206, 194, 0.15);
          border: 1px solid rgba(184, 206, 194, 0.1);
        }
      `}</style>
        </section>
    )
}