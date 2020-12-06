const isBrowser = typeof window !== 'undefined'

const screenWidth = () => {
  if (!isBrowser) { return '1000' }
  return window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth
}

const screenHeight = () => {
  if (!isBrowser) {
    return '600'
  }
  return window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight
}

export {
  screenWidth,
  screenHeight,
}
