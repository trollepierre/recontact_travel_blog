const connectHistoryApiFallback = require('connect-history-api-fallback');

const history = connectHistoryApiFallback({
  rewrites: [
    {
      from: /^\/articles\/static.*$/,
      to(context) {
        const staticPathWithHistory = context.parsedUrl.pathname.replace('/articles', '');
        return `/${staticPathWithHistory}`;
      },
    },
  ],
});

module.exports = history;
