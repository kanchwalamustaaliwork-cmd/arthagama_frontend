import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidate webhook — called by the Payload CMS after-change hook.
 * Accepts a POST with { slug, collectionSlug } and invalidates the matching
 * Next.js ISR cache tags / paths.
 *
 * Protected by a shared secret in the x-revalidate-secret header.
 */

const COLLECTION_TAG_MAP: Record<string, string[]> = {
  pages: ['pages'],
  'service-pages': ['services'],
  'team-members': ['team'],
  jobs: ['jobs'],
  testimonials: ['testimonials'],
  partners: ['partners'],
  statistics: ['statistics'],
  faqs: ['faqs'],
  'social-links': ['footer', 'navigation'],
  global: ['navigation', 'footer', 'site-settings', 'announcements'],
}

const SLUG_PATH_MAP: Record<string, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  'privacy-policy': '/privacy-policy',
  'terms-conditions': '/terms-conditions',
  navigation: '/', // revalidate all pages on nav change — layout is cached
  footer: '/',
  'site-settings': '/',
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { slug?: string; collectionSlug?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { slug, collectionSlug } = body

  try {
    // Invalidate collection-level tags
    const tags = COLLECTION_TAG_MAP[collectionSlug ?? ''] ?? []
    for (const tag of tags) {
      revalidateTag(tag, 'max')
    }

    // Also invalidate the slug-specific tag if it exists
    if (slug) {
      revalidateTag(slug, 'max')
    }

    // Revalidate specific paths where applicable
    if (slug && SLUG_PATH_MAP[slug]) {
      revalidatePath(SLUG_PATH_MAP[slug])
    }

    console.info(
      `[revalidate] Invalidated tags: [${tags.join(', ')}]${slug ? `, slug tag: ${slug}` : ''}`,
    )

    return NextResponse.json({ revalidated: true, tags, slug }, { status: 200 })
  } catch (err) {
    console.error('[revalidate] Failed:', err)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
