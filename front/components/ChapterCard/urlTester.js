export const urlTester = text => {
  const urlRegExp = new RegExp('^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?') /* eslint-disable-line no-useless-escape */
  return urlRegExp.test(text)
}

export const youtubeEmbedUrlTester = text => urlTester(text) && (/youtu.be/.test(text) || /youtube.com/.test(text)) && /embed/.test(text)
