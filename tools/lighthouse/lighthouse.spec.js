// Inspired from https://github.com/zgreen/lighthouse-circleci-example/blob/master/lighthouse.test.js
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const TIME_FOR_LIGHTHOUSE_FULL_TEST = 60000
jest.setTimeout(TIME_FOR_LIGHTHOUSE_FULL_TEST)

const launchChromeAndRunLighthouse = async url => {
  const chrome = await chromeLauncher.launch({ chromeFlags: [] })
  const opts = { chromeFlags: [], port: chrome.port }
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

test('Meaningful first paint score', () =>
  launchChromeAndRunLighthouse('https://recontact-branch.herokuapp.com/')
    .then(buildLighthouseReport)
    .then(report => {
      const { categories, lighthouseScore } = report

      expect(lighthouseScore).toBeGreaterThanOrEqual(75) // 77.8 - 75 - 78,
      expect(categories.performance.score * 100).toBeGreaterThanOrEqual(68) // 68 - 55 - 72
      expect(categories.pwa.score * 100).toBeGreaterThanOrEqual(52) // 52
      expect(categories.accessibility.score * 100).toBeGreaterThanOrEqual(95) // 95
      expect(categories['best-practices'].score * 100).toBeGreaterThanOrEqual(79) // 79
      expect(categories.seo.score * 100).toBeGreaterThanOrEqual(92) // 92
    }))
