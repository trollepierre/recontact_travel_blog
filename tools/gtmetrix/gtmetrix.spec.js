// Inspired from https://github.com/fvdm/nodejs-gtmetrix
const gtmetrix = require('gtmetrix')({
  email: 'gtmetrix@recontact.me',
  apikey: 'my-password'
})

const TIME_FOR_LIGHTHOUSE_FULL_TEST = 60000
jest.setTimeout(TIME_FOR_LIGHTHOUSE_FULL_TEST)

// Run test from London with Google Chrome
const testDetails = {
  url: 'https://french-test.recontact.me/',
  location: 2,
  browser: 3
}

// Poll test every 5 seconds for completion, then log the result
const runGtmetrix = () => gtmetrix.test.create(testDetails)
  .then(data => gtmetrix.test.get(data.test_id, 5000))


const buildGtmetrixReport = results => {
  let rows = ''
  Object.keys(results).forEach((key, value) => {
    rows += `| ${key} | ${results[key]} |\n`
  })
  console.log(rows)

  return results
}

test('Article 85 : Meaningful first paint score', () =>
  runGtmetrix()
    .then(buildGtmetrixReport)
    .then(results => {
      // const {
      //   onload_time,
      //   first_contentful_paint_time,
      //   page_elements,
      //   report_url,
      //   redirect_duration,
      //   first_paint_time,
      //   dom_content_loaded_duration,
      //   dom_content_loaded_time,
      //   dom_interactive_time,
      //   page_bytes,
      //   page_load_time,
      //   html_bytes,
      //   fully_loaded_time,
      //   html_load_time,
      //   rum_speed_index,
      //   yslow_score,
      //   pagespeed_score,
      //   backend_duration,
      //   onload_duration,
      //   connect_duration,
      // } = results

      expect(results).toMatchInlineSnapshot()
    }))

