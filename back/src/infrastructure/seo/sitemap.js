import path from 'path'

const sitemapOptions = {
  // Serve sitemap.xml generated in front/dist during SSG
  root: path.resolve(process.cwd(), '..', 'front', 'dist'),
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
  },
}

const sitemap = (req, res) => res.status(200).sendFile('sitemap.xml', sitemapOptions)

module.exports = sitemap
