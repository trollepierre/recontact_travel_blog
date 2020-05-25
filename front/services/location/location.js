const isCecile = () => {
  if (process.client) {
    return window.location.host === 'cecile.recontact.me'
  }
  return false
}

export {
  isCecile,
}
