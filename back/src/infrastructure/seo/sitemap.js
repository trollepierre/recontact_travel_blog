import { frontDistDir } from '../paths'

const sitemapOptions = {
  // Serve sitemap.xml generated in front/dist during SSG
  root: frontDistDir,
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
  },
}

const sitemap = (req, res) => res.status(200).sendFile('sitemap.xml', sitemapOptions)

module.exports = sitemap
