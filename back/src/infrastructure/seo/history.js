import connectHistoryApiFallback from 'connect-history-api-fallback'

const history = connectHistoryApiFallback({
  // Shell SPA vide généré par nitro : sans cela toute route inconnue renvoyait le HTML de l'accueil
  index: '/200.html',
  rewrites: [
    {
      from: /^\/articles\/static.*$/,
      to(context) {
        const staticPathWithHistory = context.parsedUrl.pathname.replace('/articles', '')
        return `/${staticPathWithHistory}`
      },
    },
  ],
})

module.exports = history
