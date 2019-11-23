import path from 'path'

const sitemapOptions = {
  root: path.join(__dirname, '..', '..', '..', '..', 'client', 'static'),
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
  },
}

const sitemap = (req, res) => res.status(200).sendFile('sitemap.xml', sitemapOptions)

module.exports = sitemap
