/**
 * Base CMS fetch client.
 *
 * All CMS data-fetching helpers use this function.
 * - Uses Next.js ISR cache tags for fine-grained revalidation
 * - Falls back gracefully on network errors (returns null)
 * - Never throws — callers handle null as "use fallback / empty state"
 */

const CMS_BASE_URL =
  process.env.NEXT_PUBLIC_CMS_URL ??
  process.env.CMS_URL ??
  'http://localhost:3001'

type FetchCMSOptions = {
  /** Next.js cache tags for revalidation via revalidateTag() */
  tags?: string[]
  /** ISR revalidation in seconds. Defaults to 3600 (1 hour). */
  revalidate?: number
}

export async function fetchCMS<T = unknown>(
  path: string,
  options: FetchCMSOptions = {},
): Promise<T | null> {
  const { tags = [], revalidate = 3600 } = options
  const url = `${CMS_BASE_URL}/api/public${path}`

  try {
    const res = await fetch(url, {
      next: {
        revalidate,
        tags: tags.length ? tags : undefined,
      },
    })

    if (!res.ok) {
      console.warn(`[CMS] Fetch returned ${res.status} for: ${url}`)
      return null
    }

    return (await res.json()) as T
  } catch (err) {
    console.error(`[CMS] Network error fetching ${url}:`, err)
    return null
  }
}
