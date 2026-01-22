/* Netlify Function: Trigger Netlify Build Hook without exposing the hook URL in client code */

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }
    const hookUrl = process.env.NETLIFY_BUILD_HOOK_URL
    if (!hookUrl) {
      return { statusCode: 500, body: 'Missing NETLIFY_BUILD_HOOK_URL env var' }
    }
    const res = await fetch(hookUrl, { method: 'POST' })
    const text = await res.text().catch(() => '')
    if (!res.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ ok: false, status: res.status, text }),
        headers: { 'content-type': 'application/json' },
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, status: res.status }),
      headers: { 'content-type': 'application/json' },
    }
  } catch (e) {
    return { statusCode: 500, body: String(e && e.message ? e.message : e) }
  }
}

