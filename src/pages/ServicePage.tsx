import ServicesHero from '../components/services/ServicesHero'
import ServiceContainer from '../components/services/ServiceContainer'
import { SERVICES } from '../data/services'

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen w-full pb-24">
      <ServicesHero />
      <section className="cv-section relative px-5 py-10 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-20 sm:gap-24 md:gap-28">
          {SERVICES.map((service, i) => (
            <ServiceContainer key={service.slug} service={service} reverse={i % 2 === 1} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}