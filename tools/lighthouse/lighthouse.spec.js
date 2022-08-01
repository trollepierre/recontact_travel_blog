// Inspired from https://github.com/zgreen/lighthouse-circleci-example/blob/master/lighthouse.test.js
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const TIME_FOR_LIGHTHOUSE_FULL_TEST = 60000
jest.setTimeout(TIME_FOR_LIGHTHOUSE_FULL_TEST)

const launchChromeAndRunLighthouse = async url => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'] })
  const opts = { chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'], port: chrome.port }
  const configJSON = null
  const results = await lighthouse(url, opts, configJSON)
  await chrome.kill()
  return results
}

const buildLighthouseReport = results => {
  const { categories } = results.lhr
  let rows = ''
  const scores = Object.values(categories).map(({ score }) => score * 100)
  const lighthouseScore = scores.reduce((a, b) => a + b, 0) / scores.length

  Object.values(categories).forEach(cat => {
    rows += `| ${cat.title} | ${cat.score * 100} |\n`
  })
  console.log('Total Lighthouse score is : ', lighthouseScore)
  console.log(rows)

  return { lighthouseScore, categories }
}

test('Article 85 : Meaningful first paint score', () =>
  launchChromeAndRunLighthouse('https://fr-recontact-test.netlify.app/articles/85')
    .then(buildLighthouseReport)
    .then(report => {
      const { categories, lighthouseScore } = report

      expect(lighthouseScore).toBeGreaterThanOrEqual(72) // 78, 74
      expect(categories.performance.score * 100).toBeGreaterThanOrEqual(40) // 64, 65, 64, 40 (-4 just in case)
      expect(categories.accessibility.score * 100).toBeGreaterThanOrEqual(84) // 84
      expect(categories['best-practices'].score * 100).toBeGreaterThanOrEqual(93) // 93
      expect(categories.seo.score * 100).toBeGreaterThanOrEqual(100) // 100
      expect(categories.pwa.score * 100).toBeGreaterThanOrEqual(44) // 56, 44
    }))

test('HomePage : Meaningful first paint score', () =>
  launchChromeAndRunLighthouse('https://en-recontact-test.netlify.app')
    .then(buildLighthouseReport)
    .then(report => {
      const { categories, lighthouseScore } = report

      expect(lighthouseScore).toBeGreaterThanOrEqual(83) // 86

      expect(categories.performance.score * 100).toBeGreaterThanOrEqual(70) // 78, 75, 71 => 70


      expect(categories.accessibility.score * 100).toBeGreaterThanOrEqual(98) // 96
      expect(categories['best-practices'].score * 100).toBeGreaterThanOrEqual(93) // 93
      expect(categories.seo.score * 100).toBeGreaterThanOrEqual(100) // 100
      expect(categories.pwa.score * 100).toBeGreaterThanOrEqual(100) // 100
    }))

test('Articles : Meaningful first paint score', () =>
  launchChromeAndRunLighthouse('https://en-recontact-test.netlify.app/articles')
    .then(buildLighthouseReport)
    .then(report => {
      const { categories, lighthouseScore } = report

      expect(lighthouseScore).toBeGreaterThanOrEqual(83) // 86

      expect(categories.performance.score * 100).toBeGreaterThanOrEqual(85) // 94, 93, 95, 90 (-10 just in case)
      expect(categories.accessibility.score * 100).toBeGreaterThanOrEqual(96) // 96
      expect(categories['best-practices'].score * 100).toBeGreaterThanOrEqual(100) // 100
      expect(categories.seo.score * 100).toBeGreaterThanOrEqual(100) // 100
      expect(categories.pwa.score * 100).toBeGreaterThanOrEqual(74) // 74
    }))
