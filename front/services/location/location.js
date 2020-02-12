const isCecile = () => {
  if (process.client) {
    return window.location.host === 'cecile.recontact.me'
  }
  return false
}

const isWww = () => {
  if (process.client) {
    return window.location.host === 'www.recontact.me'
  }
  return false
}

export {
  isCecile,
  isWww,
}
