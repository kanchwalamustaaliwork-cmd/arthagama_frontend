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
  ogTitle: string | null
  ogDescription: string | null
  ogImage: CMSMedia | null
  twitterCard: 'summary' | 'summary_large_image'
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: CMSMedia | null
  noindex: boolean
  noSitemap: boolean
}


// ── Navigation ─────────────────────────────────────────────

export interface CMSNavLink {
  label: string
  url: string | null
  visible: boolean
  order: number
}

export interface CMSSocialLink {
  id: string
  platform: string
  url: string
  icon: string | null
  visible: boolean
  order: number
}

export interface CMSNavigation {
  logo: CMSMedia | null
  navLinks: CMSNavLink[]
  loginButton: { label: string; url: string; visible: boolean } | null
  signupButton: { label: string; url: string; visible: boolean } | null
  dashboardButton: { label: string; url: string; visible: boolean } | null
  logoutButton: { label: string; url: string; visible: boolean } | null
  heroSocialLinks?: CMSSocialLink[]
}

// ── Footer ─────────────────────────────────────────────────

export interface CMSFooterLink {
  label: string
  url: string
}

export interface CMSFooterColumn {
  heading: string
  links: CMSFooterLink[]
}

export interface CMSFooter {
  footerCtaHeading?: string | null
  footerCtaLabel?: string | null
  footerCtaUrl?: string | null
  contactInfo?: {
    email: string | null
    phone: string | null
    address: string | null
  } | null
  columns: CMSFooterColumn[]
  bottomLinks?: CMSFooterLink[]
  socialLinks: CMSSocialLink[]
  copyright: string | null
  disclaimer: string | null
}

// ── Home Page ──────────────────────────────────────────────

export interface CMSHeroSection {
  title: string | null
  titleBold: string | null
  titleEmphasis: string | null
  titleSuffix: string | null
  subtitle: string | null
  backgroundImage?: CMSMedia | null
  heroIllustration?: CMSMedia | null
  primaryCta?: CMSCta | null
  secondaryCta?: CMSCta | null
}

export interface CMSServiceCard {
  icon: string | null
  title: string
  description: string | null
  ctaLabel: string | null
  ctaUrl: string | null
}

export interface CMSTestimonial {
  id: string
  name: string
  testimonialRole: string | null
  company: string | null
  quote: string
  photo: CMSMedia | null
  rating: number | null
  order?: number
}

export interface CMSPartner {
  id: string
  name: string
  logo: CMSMedia | null
  url: string | null
  order?: number
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
    cards?: CMSServiceCard[]
  }
  strategiesSection: {
    heading: string | null
    description: string | null
    ctaLabel?: string | null
    ctaUrl?: string | null
    cards?: Array<{ name: string; description: string | null }>
  }
  homeFaq?: {
    heading: string | null
    faqs: CMSFAQ[]
  }
  homeTestimonials?: {
    heading: string | null
    visible: boolean
    testimonials: CMSTestimonial[]
  }
  partnersSection?: {
    heading: string | null
    visible: boolean
    partners: CMSPartner[]
  }
  homeCta?: {
    heading: string | null
    subtitle: string | null
    ctaLabel: string | null
    ctaUrl: string | null
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
    title: string | null
    titleHighlight?: string | null
    subtitle: string | null
    backgroundImage?: CMSMedia | null
  }
  missionVision: {
    missionHeading: string | null
    mission: string | null
    visionHeading: string | null
    vision: string | null
  }
  companyValues: Array<{ title: string; description: string | null }>
  journey: {
    heading: string | null
    events: Array<{ year: string; title: string; description: string | null }>
  }
  teamSectionHeading?: string | null
  teamSectionSubtext?: string | null
  cta: { heading: string | null; subtext: string | null; label: string | null; url: string | null }
  updatedAt: string
}

// ── Careers Page ───────────────────────────────────────────

export interface CMSCareersPage {
  id: string
  title: string
  slug: string
  seo: CMSSeo
  careersHero: {
    heading: string | null
    titleHighlight?: string | null
    subtitle: string | null
    backgroundImage?: CMSMedia | null
  }
  careersIntro: {
    heading: string | null
    body: string | null
  }
  culturePoints: Array<{ title: string; body: string }>
  typewriterRoles: string[]
  careersBenefits: {
    heading: string | null
    items: Array<{ title: string; description: string | null }>
  }
  hiringProcess: {
    heading: string | null
    steps: Array<{ stepNumber: number | null; title: string; description: string | null }>
  }
  openRolesHeading?: string | null
  teamDescription?: string | null
  careersEmptyState: {
    heading: string | null
    body: string | null
  }
  careersCta: {
    heading: string | null
    subtitle: string | null
    ctaLabel: string | null
    ctaUrl: string | null
  }
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

import type { ServiceSummary } from './services'

// ── Service Pages ──────────────────────────────────────────

export interface CMSServiceLandingPage {
  id: string
  title: string
  slug: string
  seo: CMSSeo
  servicesHero: {
    heading: string | null
    titleHighlight?: string | null
    subtitle: string | null
    backgroundImage?: CMSMedia | null
  }
  serviceCards?: ServiceSummary[]
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
  hero: {
    title: string | null
    titleHighlight?: string | null
    subtitle: string | null
    backgroundImage?: CMSMedia | null
  }
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
  contactCta?: {
    heading: string | null
    subtitle: string | null
    ctaLabel: string | null
    ctaUrl: string | null
  }
  seo: CMSSeo
}

// ── Legal Pages ────────────────────────────────────────────

export interface CMSLegalSection {
  id: string
  heading: string
  paragraphs: string[]
}

export interface CMSLegalPage {
  id: string
  title: string
  slug: string
  intro?: string | null
  sections?: CMSLegalSection[]
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
