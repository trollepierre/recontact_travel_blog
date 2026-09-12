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

// Thresholds are the lowest value observed minus a margin, not a target.
//
// Measured on CI, runs of 2026-09-12 (performance / accessibility /
// best-practices / seo):
//   HomePage    87 94 96 91  then  74 93 100 83
//   Articles    73 90 73 83  then  86 90  77 83
//   Article 85  37 96 77 100
//
// Two runs of the same page move by up to 13 points on performance and 8 on
// seo, so these margins are wide on purpose: they catch a collapse, not a
// regression. Tightening them needs more samples, or a median over several
// Lighthouse runs per page.
const PAGES = [
  {
    name: 'Article 85',
    url: 'https://fr-recontact-test.netlify.app/articles/85',
    expected: {
      total: 65, performance: 25, accessibility: 88, 'best-practices': 68, seo: 88,
    },
  },
  {
    name: 'HomePage',
    url: 'https://en-recontact-test.netlify.app',
    expected: {
      total: 78, performance: 60, accessibility: 88, 'best-practices': 88, seo: 75,
    },
  },
  {
    name: 'Articles',
    url: 'https://en-recontact-test.netlify.app/articles',
    expected: {
      total: 72, performance: 58, accessibility: 85, 'best-practices': 65, seo: 75,
    },
  },
]

PAGES.forEach(({ name, url, expected }) => {
  test(`${name} : Meaningful first paint score`, { timeout: TIMEOUT }, async () => {
    await audit(url, expected)
  })
})
