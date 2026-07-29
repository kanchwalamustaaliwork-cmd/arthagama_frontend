import { getContactPage } from '@/src/lib/cms/contact'
import ContactPageView from '@/src/views/ContactPage'
import type { CMSContactCard } from '@/src/types/cms'
import type { ContactInfoItem } from '@/src/data/contactInfo'

function cmsCardToContactInfo(card: CMSContactCard): ContactInfoItem {
  return {
    id: `${card.icon}-${card.label}`,
    label: card.label,
    value: card.value,
    href: card.href,
    icon: card.icon as ContactInfoItem['icon'],
  }
}

export default async function ContactPage() {
  const cmsContact = await getContactPage()
  const contactCards = cmsContact?.contactCards?.map(cmsCardToContactInfo)

  return <ContactPageView cmsContactCards={contactCards} />
}
