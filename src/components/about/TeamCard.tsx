import { motion } from 'framer-motion'
import type { TeamMember } from '../../data/team'
import { FaArrowUpRightFromSquare, FaLinkedin } from 'react-icons/fa6'

interface TeamCardProps {
    member: TeamMember
    index: number
    onSelect: () => void
}

export default function TeamCard({ member, index, onSelect }: TeamCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.07 }}
            viewport={{ once: true, margin: '-80px' }}
            whileHover={{ y: -6 }}
            className="team-card group relative flex flex-col overflow-hidden rounded-3xl cursor-pointer"
            onClick={onSelect}
        >
            <motion.div layoutId={`photo-${member.id}`} className="relative h-64 w-full overflow-hidden sm:h-72">
                <motion.img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#122124]/70 via-transparent to-transparent" />
            </motion.div>

            <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <motion.h3 layoutId={`name-${member.id}`} className="text-lg font-body font-semibold text-[#1B3236]">
                    {member.name}
                </motion.h3>
                <p className="text-xs uppercase tracking-[0.15em] text-[#244147]/70">{member.designation}</p>

                <div className="mt-2 flex items-center justify-between">
                    <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#244147]/10 text-[#244147] transition-colors duration-300 hover:bg-[#244147] hover:text-[#EAF1EC]"
                    >
                        <FaLinkedin className="h-3.5 w-3.5" />
                    </a>

                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#244147]/80 transition-colors duration-300 group-hover:text-[#1B3236]">
                        View Details
                        <FaArrowUpRightFromSquare className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                </div>
            </div>

            <style>{`
        .team-card {
          background: rgba(184, 206, 194, 0.85);
          backdrop-filter: blur(14px) saturate(1.1);
          -webkit-backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.95);
          box-shadow: 0 2px 16px rgba(18, 33, 36, 0.25);
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .team-card:hover {
          box-shadow: 0 20px 45px -15px rgba(18, 33, 36, 0.4);
          border-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
        </motion.div >
    )
}