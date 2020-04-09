export const urlTester = text => {
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/.test(text)
}

export const youtubeEmbedUrlTester = text => urlTester(text) && (/youtu.be/.test(text) || /youtube.com/.test(text)) && /embed/.test(text)
