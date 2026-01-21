import fs from 'node:fs/promises'

const apiBase =
  process.env.NUXT_PUBLIC_API_BASE ||
  process.env.NUXT_ENV_API_URL ||
  process.env.API_URL

async function main() {
  try {
    if (!apiBase) {
      console.log('[prerender] No API base provided, skipping routes generation')
      return
    }
    const base = apiBase.replace(/\/+$/, '')
    const url = `${base}/api/articles?limit=0`
    console.log('[prerender] Fetching', url)
    const res = await fetch(url)
    if (!res.ok) {
      console.warn('[prerender] Failed to fetch articles:', res.status, await res.text())
      return
    }
    const items = await res.json()
    if (!Array.isArray(items)) {
      console.warn('[prerender] Unexpected articles payload, skipping')
      return
    }
    const routes = new Set(['/','/articles'])
    for (const it of items) {
      const id = typeof it?.dropboxId === 'number' || typeof it?.dropboxId === 'string' ? String(it.dropboxId) : null
      if (id) {
        routes.add(`/articles/${id}`)
      }
    }
    const list = Array.from(routes)
    await fs.writeFile('.prerender-routes.json', JSON.stringify(list, null, 2), 'utf8')
    console.log(`[prerender] Wrote ${list.length} routes to .prerender-routes.json`)
  } catch (e) {
    console.error('[prerender] Error generating routes', e)
    // Do not hard-fail build on route discovery issues
  }
}

await main()

