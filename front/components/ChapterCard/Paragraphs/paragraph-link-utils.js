const urlTester = link => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/.test(link)

const youtubeEmbedUrlTester = link => urlTester(link) && (/youtu.be/.test(link) || /youtube.com/.test(link)) && /embed/.test(link)
const youtubePlaylistEmbedUrlTester = link => /videoseries\?list=/.test(link)
const generateIframeLink = link => youtubePlaylistEmbedUrlTester(link) ? link : `${link}?rel=0&modestbranding=1`
const generateCleanUrlLink = link => link.includes('https://') ? link : `https://${link}`

export {
  youtubeEmbedUrlTester,
  youtubePlaylistEmbedUrlTester,
  generateCleanUrlLink,
  generateIframeLink,
  urlTester,
}
