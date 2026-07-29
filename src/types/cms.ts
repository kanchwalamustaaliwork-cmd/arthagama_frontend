/**
 * TypeScript types for Payload CMS API responses.
 * These mirror the flattened response shapes from the CMS public API endpoints.
 * Frontend components use these types — never raw Payload types.
 */

// ── Shared Primitives ──────────────────────────────────────

export interface CMSMedia {
  url: string | null
  alt: string
  width: number | null
  height: number | null
  thumbnail: string | null
  hero: string | null
}

export interface CMSCta {
  label: string | null
  url: string | null
  openInNewTab: boolean
}

export interface CMSSeo {
  metaTitle: string | null
  metaDescription: string | null
  keywords: string | null
  canonicalUrl: string | null
  ogImage: CMSMedia | null
  twitterCard: 'summary' | 'summary_large_image'
  noindex: boolean
  noSitemap: boolean
}

// ── Site Settings ──────────────────────────────────────────

export interface CMSSiteSettings {
  siteName: string
  tagline: string | null
  logo: CMSMedia | null
  logoDark: CMSMedia | null
  logoLight: CMSMedia | null
  favicon: CMSMedia | null
  primaryColor: string | null
  secondaryColor: string | null
  backgroundVideo: CMSMedia | null
  backgroundVideoUrl: string | null
  email: string | null
  supportEmail: string | null
  salesEmail: string | null
  phone: string | null
  phonePretty: string | null
  address: string | null
  googleMapsUrl: string | null
  workingHours: string | null
  seoDefaults: {
    metaTitle: string | null
    metaDescription: string | null
    ogImage: CMSMedia | null
    twitterHandle: string | null
  }
  analytics: {
    googleAnalyticsId: string | null
    metaPixelId: string | null
  }
}

// ── Navigation ─────────────────────────────────────────────

export interface CMSNavDropdownItem {
  label: string
  url: string
  description: string | null
  icon: string | null
  visible: boolean
}

export interface CMSNavLink {
  label: string
  url: string | null
  openInNewTab: boolean
  visible: boolean
  order: number
  dropdown: CMSNavDropdownItem[]
}

export interface CMSNavigation {
  logo: CMSMedia | null
  navLinks: CMSNavLink[]
  ctaButton: { label: string | null; url: string | null; visible: boolean } | null
  loginButton: { label: string; url: string; visible: boolean } | null
  signupButton: { label: string; url: string; visible: boolean } | null
}

// ── Footer ─────────────────────────────────────────────────

export interface CMSFooterLink {
  label: string
  url: string
  openInNewTab: boolean
}

export interface CMSFooterColumn {
  heading: string
  links: CMSFooterLink[]
}

export interface CMSSocialLink {
  id: string
  platform: string
  url: string
  icon: string | null
  visible: boolean
  order: number
}

export interface CMSFooter {
  columns: CMSFooterColumn[]
  newsletter: {
    visible: boolean
    heading: string | null
    subtext: string | null
    placeholder: string
    buttonLabel: string
  } | null
  socialLinks: CMSSocialLink[]
  copyright: string | null
  disclaimer: string | null
  logo: CMSMedia | null
  tagline: string | null
}

// ── Home Page ──────────────────────────────────────────────

export interface CMSHeroSection {
  title: string | null
  titleBold: string | null
  titleEmphasis: string | null
  titleSuffix: string | null
  subtitle: string | null
  backgroundImage: CMSMedia | null
  heroIllustration: CMSMedia | null
  primaryCta: CMSCta | null
  secondaryCta: CMSCta | null
}

export interface CMSServiceCard {
  icon: string | null
  title: string
  description: string | null
  ctaLabel: string | null
  ctaUrl: string | null
}

export interface CMSHomePage {
  id: string
  title: string
  slug: string
  seo: CMSSeo
  hero: CMSHeroSection
  whatWeDo: {
    heading: string | null
    subheading: string | null
    cards: CMSServiceCard[]
  }
  strategiesSection: {
    heading: string | null
    description: string | null
    ctaLabel: string | null
    ctaUrl: string | null
  }
  partnersSection: {
    heading: string | null
    visible: boolean
    partners: Array<{ id: string; name: string; logo: CMSMedia | null; url: string | null }>
  }
  showLatestNews: boolean
  updatedAt: string
}

// ── About Page ─────────────────────────────────────────────

export interface CMSAboutPage {
  id: string
  title: string
  slug: string
  seo: CMSSeo
  hero: {
    eyebrow: string | null
    title: string | null
    subtitle: string | null
    backgroundImage: CMSMedia | null
  }
  missionVision: {
    missionHeading: string | null
    mission: string | null
    visionHeading: string | null
    vision: string | null
  }
  companyValues: Array<{ title: string; description: string | null; icon: string | null }>
  journey: {
    heading: string | null
    events: Array<{ year: string; title: string; description: string | null }>
  }
  companyNumbers: Array<{ number: string; label: string }>
  cta: { heading: string | null; subtext: string | null; label: string | null; url: string | null }
  updatedAt: string
}

// ── Team Members ───────────────────────────────────────────

export interface CMSTeamMember {
  id: string
  name: string
  designation: string
  memberRole: 'founder' | 'leadership' | 'employee' | 'advisor'
  photo: CMSMedia | null
  intro: string | null
  specialization: string | null
  roleDescription: string | null
  linkedin: string | null
  twitter: string | null
  order: number
}

// ── Service Pages ──────────────────────────────────────────

export interface CMSServicePage {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  visible: boolean
  order: number
  highlights: string[]
  hero: {
    title: string | null
    subtitle: string | null
    backgroundImage: CMSMedia | null
    cta: CMSCta | null
  }
  featuresSection: {
    heading: string | null
    subheading: string | null
    features: Array<{ icon: string | null; title: string; description: string | null }>
  }
  benefitsSection: {
    heading: string | null
    benefits: Array<{ title: string; description: string | null }>
  }
  stepsSection: {
    heading: string | null
    steps: Array<{ stepNumber: number | null; title: string; description: string | null; icon: string | null }>
  }
  faqSection: {
    heading: string | null
    faqs: Array<{ question: string; answer: string }>
  }
  seo: CMSSeo
  updatedAt: string
}

// ── Jobs ───────────────────────────────────────────────────

export type CMSJobDepartment =
  | 'engineering'
  | 'research'
  | 'finance'
  | 'operations'
  | 'marketing'
  | 'product'

export type CMSJobType = 'full-time' | 'part-time' | 'internship' | 'contract'

export interface CMSJob {
  id: string
  title: string
  department: CMSJobDepartment
  type: CMSJobType
  location: string
  summary: string
  salaryRange: {
    min: number | null
    max: number | null
    currency: string
    display: string | null
  } | null
  responsibilities: string[]
  requirements: string[]
  applyUrl: string | null
  enabled: boolean
  order: number
  postedAt: string | null
}

// ── Contact Page ───────────────────────────────────────────

export interface CMSContactCard {
  icon: 'phone' | 'mail' | 'pin' | 'clock'
  label: string
  value: string
  href: string
}

export interface CMSContactPage {
  id: string
  hero: { title: string | null; subtitle: string | null }
  contactInfo: {
    phone: string | null
    phonePretty: string | null
    email: string | null
    supportEmail: string | null
    salesEmail: string | null
    address: string | null
    googleMapsUrl: string | null
    workingHours: string | null
  }
  contactCards: CMSContactCard[]
  seo: CMSSeo
}

// ── Legal Pages ────────────────────────────────────────────

export interface CMSLegalPage {
  id: string
  title: string
  slug: string
  // Lexical rich text — passed to a renderer component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any | null
  lastUpdated: string | null
  seo: CMSSeo
}

// ── Statistics ─────────────────────────────────────────────

export interface CMSStatistic {
  id: string
  number: string
  suffix: string | null
  title: string
  description: string | null
  order: number
}

// ── FAQs ───────────────────────────────────────────────────

export interface CMSFAQ {
  id: string
  question: string
  answer: string
  category: string | null
  order: number
}
