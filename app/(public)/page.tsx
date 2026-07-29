import { getHomePage } from '@/src/lib/cms/home'
import HomePageView from '@/src/views/HomePage'

/**
 * Home page — server component.
 * Fetches CMS data and passes it to the client-side HomePageView.
 * Falls back gracefully if CMS is unavailable.
 */
export default async function HomePage() {
  const cmsData = await getHomePage()
  return <HomePageView cmsData={cmsData} />
}
