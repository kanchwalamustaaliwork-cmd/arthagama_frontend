import { motion } from 'framer-motion'
import { easing } from '../../constans/animation'
import { BRAND_ON_DARK } from '@/src/utils/brand'

export default function ServicesHero() {
    return (
        <section
            className="cv-section relative px-5 pt-32 pb-16 sm:px-6 sm:pt-36 md:px-10 lg:px-16"
            style={{ perspective: 1200 }}
        >
            <div className="mx-auto max-w-[1200px] text-center">

                {/* Perspective Entrance — tilts in from depth rather than blurring or masking in */}
                <motion.h1
                    initial={{ opacity: 0, rotateX: 35, y: 40 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    transition={{ duration: 1, ease: easing, delay: 0.15 }}
                    style={{ transformOrigin: 'top center' }}
                    className="text-shadow-soft mx-auto max-w-3xl font-body text-4xl font-light leading-[1.1] text-[#EAF1EC] sm:text-5xl md:text-6xl"
                >
                    Services built for <em className="font-display font-semibold text-[#EAF1EC]">every stage</em> of your trading journey
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easing, delay: 0.6 }}
                    className="text-shadow-soft mx-auto mt-6 max-w-lg text-sm text-[#DCE7E1]/85 sm:text-base"
                >
                    From building a strategy to trading it live — explore how <strong className={BRAND_ON_DARK}>ARTHAGAMA</strong> can work with you.
                </motion.p>
            </div>

            <style>{`.text-shadow-soft { text-shadow: 0 2px 14px rgba(0,0,0,0.4); }`}</style>
        </section>
    )
}