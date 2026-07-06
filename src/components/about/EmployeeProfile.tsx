import { motion } from 'framer-motion'
import type { TeamMember } from '../../data/team'
import { FaLinkedin } from 'react-icons/fa6'
import { X } from 'lucide-react'

interface EmployeeProfileProps {
    member: TeamMember
    onClose: () => void
}

export default function EmployeeProfile({ member, onClose }: EmployeeProfileProps) {
    return (
        <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="absolute inset-0 scrim"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            <motion.div
                className="profile-card relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] sm:flex-row"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#122124]/40 text-[#EAF1EC] backdrop-blur-sm transition-colors hover:bg-[#122124]/60"
                >
                    <X className="h-4 w-4" />
                </button>

                <motion.div layoutId={`photo-${member.id}`} className="relative h-64 w-full overflow-hidden sm:h-auto sm:w-[42%]">
                    <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#122124]/50 via-transparent to-transparent sm:bg-gradient-to-r" />
                </motion.div>

                <div className="flex flex-1 flex-col gap-5 p-7 sm:p-9">
                    <div>
                        <motion.h3 layoutId={`name-${member.id}`} className="text-2xl font-body font-semibold text-[#1B3236] sm:text-3xl">
                            {member.name}
                        </motion.h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#244147]/70">
                            {member.designation}
                        </p>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="text-sm leading-relaxed text-[#244147]/85"
                    >
                        {member.intro}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        className="flex flex-col gap-3 border-t border-[#244147]/12 pt-5"
                    >
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#244147]/55">Specialization</p>
                            <p className="mt-1 text-sm text-[#1B3236]">{member.specialization}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#244147]/55">Role at Arthagama</p>
                            <p className="mt-1 text-sm text-[#1B3236]">{member.role}</p>
                        </div>
                    </motion.div>

                    <motion.a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#244147] px-5 py-2.5 text-xs font-medium text-[#EAF1EC] transition-transform duration-300 hover:scale-105"
                    >
                        <FaLinkedin className="h-3.5 w-3.5" />
                        Connect on LinkedIn
                    </motion.a>
                </div>
            </motion.div>

            <style>{`
        .scrim {
          background: rgba(12, 22, 24, 0.68);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .profile-card {
          background: rgba(184, 206, 194, 0.96);
          box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.6);
        }
      `}</style>
        </motion.div>
    )
}