export default key => {
  if (key === 'API_URL') {
    return `${process.env.NUXT_ENV_API_URL }/`
  }
  return process.env[key]
}
