import { motion } from 'framer-motion'
import ContactHero from '../components/contact/ContactHero'
import ContactInfoCards from '../components/contact/ContactInfoCards'
import ContactForm from '../components/contact/ContactForm'
import ContactMap from '../components/contact/ContactMap'
import { easing } from '../constans/animation'


export default function ContactPage() {
  return (
    <div className="relative min-h-screen w-full pb-24">
      <ContactHero />

      <section className="cv-section relative px-5 pb-14 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <ContactInfoCards />
        </div>
      </section>

      <section className="cv-section relative px-5 py-6 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easing }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <ContactForm />
          </motion.div>
          <div className="lg:col-span-6">
            <ContactMap />
          </div>
        </div>
      </section>
    </div>
  )
}
