"use client"

import { motion } from 'framer-motion'
import Hero from '../components/ui/Hero'
import ContactInfoCards from '../components/contact/ContactInfoCards'
import ContactForm from '../components/contact/ContactForm'
import ContactMap from '../components/contact/ContactMap'
import ContactCtaSection from '../components/contact/ContactCtaSection'
import { easing } from '../constans/animation'
import type { ContactInfoItem } from '../data/contactInfo'
import type { CMSContactPage } from '../types/cms'

interface ContactPageProps {
  cmsContactCards?: ContactInfoItem[]
  cmsContactPage?: CMSContactPage | null
}

export default function ContactPage({ cmsContactCards, cmsContactPage }: ContactPageProps) {
  return (
    <div className="relative min-h-screen w-full pb-24">
      <Hero
        title={cmsContactPage?.hero?.title ?? "Let's start a conversation"}
        titleHighlight={cmsContactPage?.hero?.titleHighlight ?? 'conversation'}
        subtitle={
          cmsContactPage?.hero?.subtitle ??
          "Whether you're exploring strategies, evaluating a partnership, or just have a question — our team typically responds within one business day."
        }
        backgroundImage={cmsContactPage?.hero?.backgroundImage}
      />

      <section className="cv-section relative px-5 pb-14 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <ContactInfoCards contactCards={cmsContactCards} />
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
            <ContactMap
              googleMapsUrl={cmsContactPage?.contactInfo?.googleMapsUrl}
              address={cmsContactPage?.contactInfo?.address}
            />
          </div>
        </div>
      </section>

      <ContactCtaSection cmsCta={cmsContactPage?.contactCta} />
    </div>
  )
}
