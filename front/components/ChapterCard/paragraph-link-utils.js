const urlTester = text => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/.test(text)

const youtubeEmbedUrlTester = text => urlTester(text) && (/youtu.be/.test(text) || /youtube.com/.test(text)) && /embed/.test(text)
const generateIframeLink = paragraph => `${paragraph}?rel=0&modestbranding=1`
const generateCleanUrlLink = paragraph => paragraph.includes('https://') ? paragraph : `https://${paragraph}`

export {
  youtubeEmbedUrlTester,
  generateCleanUrlLink,
  generateIframeLink,
  urlTester,
}
