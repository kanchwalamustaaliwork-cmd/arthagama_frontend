import { getServices } from '@/src/lib/cms/services'
import ServicesPageView from '@/src/views/ServicePage'

export default async function ServicesPage() {
  const cmsServices = await getServices()
  return <ServicesPageView cmsServices={cmsServices} />
}
