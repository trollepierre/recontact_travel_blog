module.exports = {
  compile(model) {
    const { addedArticles } = model;

    let template = '<p>Hello,</p>';
    template += '<p>There are some news on <a href="http://www.recontact.me/#">Recontact Me</a>.</p>';
    template += '<p>';
    if (addedArticles.length === 1) {
      template += 'One new article:';
    } else {
      template += `${addedArticles.length} new articles:`;
    }
    template += '<ul>';
    addedArticles.forEach((article) => {
      template += `<li><a href="http://www.recontact.me/#/articles/${article.dropboxId}">${article.enTitle}</a></li>`;
    });
    template += '</ul>';
    template += '</p>';
    return template;
  },
};
