const lighthouse = require('lighthouse') // Node CLI for Lighthouse https://www.npmjs.com/package/lighthouse#using-the-node-cli
const chromeLauncher = require('chrome-launcher') // Launch Chrome from node

jest.setTimeout(60000)

const launchChromeAndRunLighthouse = (
  url,
  opts = { chromeFlags: [] },
  config = null,
) =>
  chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then((chrome) => {
    opts.port = chrome.port
    return lighthouse(url, opts, config).then(results =>
      chrome.kill().then(() => {
        // console.log(results);

        return results
      }))
  })

test('Meaningful first paint score', () =>
  launchChromeAndRunLighthouse('https://recontact-branch.herokuapp.com//').then((results) => {
    const { categories } = results.lhr
    let rows = ''
    const scores = Object.values(categories).map(({ score }) => score * 100)
    const calcul = scores.reduce((a, b) => a + b, 0) / scores.length

    Object.values(categories).forEach((cat) => {
      rows += `| ${cat.title} | ${cat.score * 100} |\n`
    })

    console.log('Total score is : ', calcul)
    console.log(rows)

    expect(calcul).toBeGreaterThanOrEqual(65) // 68.6
    expect(categories.performance.score * 100).toBeGreaterThanOrEqual(30) // 45, 55, 43
    expect(categories.pwa.score * 100).toBeGreaterThanOrEqual(45) // 46
    expect(categories.accessibility.score * 100).toBeGreaterThanOrEqual(70) // 73
    expect(categories['best-practices'].score * 100).toBeGreaterThanOrEqual(75) // 80
    expect(categories.seo.score * 100).toBeGreaterThanOrEqual(85) // 89
  }))
