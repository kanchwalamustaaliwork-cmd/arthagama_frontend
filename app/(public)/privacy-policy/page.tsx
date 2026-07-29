import { getPrivacyPolicy } from '@/src/lib/cms/legal'
import PrivacyPolicyView from '@/src/views/PrivacyPolicy'

export default async function PrivacyPolicyPage() {
  const cmsLegal = await getPrivacyPolicy()
  return <PrivacyPolicyView cmsLegal={cmsLegal} />
}
