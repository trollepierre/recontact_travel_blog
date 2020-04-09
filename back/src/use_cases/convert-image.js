import DropboxClient from '../infrastructure/external_services/dropbox-client'

const convertJpgToWebp = async jpgFile => {
  const webpFile = await jpgFile
  return webpFile
}

const convertImage = async () => {
  try {
    const id = '85'
    const jpgFile = await DropboxClient.filesDownload('/85/img0.jpg')
    const file = await convertJpgToWebp(jpgFile)
    await DropboxClient.filesUpload({ path: `/${id}/img0.webp`, file })
  } catch (error) {
    console.error(error)
  }
}

export default {
  convertImage,
}
