// Inspired from https://github.com/zgreen/lighthouse-circleci-example/blob/master/lighthouse.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'

const TIMEOUT = 90000

// Lighthouse 13 added an "Agentic Browsing" category that scores very low and is
// unrelated to what this suite watches. The aggregate stays on the four historical
// categories so the numbers remain comparable with the ones noted below.
const SCORED_CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']

const launchChromeAndRunLighthouse = async url => {
  const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] })
  try {
    return await lighthouse(url, { chromeFlags: [], port: chrome.port }, null)
  } finally {
    await chrome.kill()
  }
}

const buildLighthouseReport = results => {
  const { categories } = results.lhr
  const scores = SCORED_CATEGORIES.map(key => categories[key].score * 100)
  const lighthouseScore = scores.reduce((a, b) => a + b, 0) / scores.length

  Object.values(categories).forEach(cat => {
    console.log(`| ${cat.title} | ${cat.score * 100} |`)
  })
  console.log('Total Lighthouse score is : ', lighthouseScore)

  return { lighthouseScore, categories }
}

const audit = async (url, expected) => {
  const results = await launchChromeAndRunLighthouse(url)
  const { lighthouseScore, categories } = buildLighthouseReport(results)

  assert.ok(
    lighthouseScore >= expected.total,
    `total ${lighthouseScore} < ${expected.total} on ${url}`,
  )
  SCORED_CATEGORIES.forEach(key => {
    const score = categories[key].score * 100
    assert.ok(score >= expected[key], `${key} ${score} < ${expected[key]} on ${url}`)
  })
}

// Thresholds calibrated on the 2026-09-12 CI run, with room for Lighthouse's
// run-to-run variance (performance is the noisy one).
const PAGES = [
  {
    name: 'Article 85',
    url: 'https://fr-recontact-test.netlify.app/articles/85',
    // never measured under Lighthouse 13, thresholds derived from the other two
    expected: {
      total: 60, performance: 40, accessibility: 80, 'best-practices': 65, seo: 78,
    },
  },
  {
    name: 'HomePage',
    url: 'https://en-recontact-test.netlify.app',
    // measured 87 / 94 / 96 / 91, aggregate 92
    expected: {
      total: 82, performance: 70, accessibility: 90, 'best-practices': 90, seo: 85,
    },
  },
  {
    name: 'Articles',
    url: 'https://en-recontact-test.netlify.app/articles',
    // measured 73 / 90 / 73 / 83, aggregate 79.75
    expected: {
      total: 70, performance: 60, accessibility: 85, 'best-practices': 65, seo: 78,
    },
  },
]

PAGES.forEach(({ name, url, expected }) => {
  test(`${name} : Meaningful first paint score`, { timeout: TIMEOUT }, async () => {
    await audit(url, expected)
  })
})
