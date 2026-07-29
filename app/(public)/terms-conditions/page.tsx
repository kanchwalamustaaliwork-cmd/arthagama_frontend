import { getTerms } from '@/src/lib/cms/legal'
import TermsAndConditionView from '@/src/views/TermsAndCondition'

export default async function TermsAndConditionPage() {
  const cmsLegal = await getTerms()
  return <TermsAndConditionView cmsLegal={cmsLegal} />
}
