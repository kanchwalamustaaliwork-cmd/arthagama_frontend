import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ServiceContainerProps } from '../../types/services'
import { easing } from '../../constans/animation'



export default function ServiceContainer({ service, reverse, index }: ServiceContainerProps) {
    return (
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14">
            {/* Directional Reveal — text slides in from the side it visually sits on */}
            <motion.div
                className={reverse ? 'md:order-2' : 'md:order-1'}
                initial={{ opacity: 0, x: reverse ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: easing }}
                viewport={{ once: true, margin: '-100px' }}
            >
                <span className="mb-4 inline-block rounded-full bg-[#B8CEC2]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#B8CEC2]/80">
                    0{index + 1}
                </span>
                <h3 className="mb-4 text-2xl font-body font-light text-[#EAF1EC] sm:text-3xl md:text-4xl">
                    {service.title}
                </h3>
                <p className="mb-6 max-w-md text-sm leading-relaxed text-[#DCE7E1]/80 sm:text-base">
                    {service.shortDescription}
                </p>
                <ul className="mb-8 flex flex-col gap-2.5">
                    {service.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2.5 text-sm text-[#DCE7E1]/75">
                            <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[#B8CEC2]" />
                            {h}
                        </li>
                    ))}
                </ul>
                <Link
                    to={`/services/${service.slug}`}
                    className="cta-btn group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-xs font-medium text-[#1B3236]"
                >
                    {/* Shine Sweep on hover */}
                    <span className="shine-sweep pointer-events-none absolute inset-0" />
                    <span className="relative z-10">{service.ctaLabel}</span>
                    <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            </motion.div>

            {/* Scale Fade + Hover Elevation on the image */}
            <motion.div
                className={reverse ? 'md:order-1' : 'md:order-2'}
                initial={{ opacity: 0, x: reverse ? -60 : 60, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: easing, delay: 0.1 }}
                viewport={{ once: true, margin: '-100px' }}
                whileHover={{ y: -6 }}
            >
                <div className="service-image-frame relative overflow-hidden rounded-3xl">
                    <img
                        src={service.image}
                        alt={service.title}
                        className="h-64 w-full object-cover sm:h-80 md:h-[380px]"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#122124]/50 via-transparent to-transparent" />
                </div>
            </motion.div>

            <style>{`
        .cta-btn { background: #B8CEC2; transition: transform 0.3s ease; }
        .cta-btn:hover { transform: translateY(-1px); }
        .shine-sweep {
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
        }
        .cta-btn:hover .shine-sweep { transform: translateX(120%); }
        .service-image-frame {
          border: 1px solid rgba(184, 206, 194, 0.2);
          box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.5);
        }
      `}</style>
        </div>
    )
}