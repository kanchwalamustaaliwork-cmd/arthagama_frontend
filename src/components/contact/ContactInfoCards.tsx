import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CONTACT_INFO } from '../../data/contactInfo'
import { PhoneIcon, MailIcon, PinIcon } from './icons'
import { easing } from '../../constans/animation'

const ICONS = { phone: PhoneIcon, mail: MailIcon, pin: PinIcon }

export default function ContactInfoCards() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {CONTACT_INFO.map((item, i) => {
                const Icon = ICONS[item.icon]
                return (
                    <motion.a
                        key={item.id}
                        href={item.href}
                        target={item.icon === 'pin' ? '_blank' : undefined}
                        rel={item.icon === 'pin' ? 'noreferrer' : undefined}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.7,
                            ease: easing,
                            delay: i * 0.1,
                            scale: {
                                type: 'spring',
                                stiffness: 260,
                                damping: 22,
                            },
                            paddingBottom: {
                                type: 'spring',
                                stiffness: 260,
                                damping: 22,
                            },
                        }}
                        viewport={{ once: true, margin: '-80px' }}
                        className="info-card group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6"
                        // Expand on Hover — card grows slightly and gains extra bottom padding to reveal the arrow row
                        whileHover={{ scale: 1.03, paddingBottom: 28 }}
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#244147]/10 text-[#244147] transition-colors duration-300 group-hover:bg-[#244147] group-hover:text-[#EAF1EC]">
                            <Icon />
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#244147]/55">
                                {item.label}
                            </p>
                            <p className="mt-1 text-sm font-medium text-[#1B3236] sm:text-base">
                                {item.value}
                            </p>
                        </div>

                        <motion.span
                            className="flex items-center gap-1 text-xs font-medium text-[#244147]/0 group-hover:text-[#244147]/80 transition-colors duration-300"
                        >
                            Open
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </motion.span>
                    </motion.a>
                )
            })}

            <style>{`
        .info-card {
          background: rgba(184, 206, 194, 0.9);
          border: 1px solid rgba(184, 206, 194, 1);
          box-shadow: 0 2px 16px rgba(18, 33, 36, 0.22);
        }
        .info-card:hover {
          box-shadow: 0 20px 45px -15px rgba(18, 33, 36, 0.35);
        }
      `}</style>
        </div>
    )
}