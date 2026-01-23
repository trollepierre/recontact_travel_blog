const urlTester = link => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/.test(link)

const youtubeEmbedUrlTester = link => urlTester(link) && (/youtu.be/.test(link) || /youtube.com/.test(link)) && /embed/.test(link)
const youtubePlaylistEmbedUrlTester = link => /videoseries\?list=/.test(link)
const generateIframeLink = link => youtubePlaylistEmbedUrlTester(link) ? link : `${link}?rel=0&modestbranding=1`
const generateCleanUrlLink = link => {
  const val = String(link || '').trim()
  if (/^https?:\/\//i.test(val)) { return val }
  if (/^\/\//.test(val)) { return `https:${val}` }
  return `https://${val}`
}

export {
  youtubeEmbedUrlTester,
  youtubePlaylistEmbedUrlTester,
  generateCleanUrlLink,
  generateIframeLink,
  urlTester,
}
