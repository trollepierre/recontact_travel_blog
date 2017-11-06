module.exports = {
  compile(model) {
    const { addedArticles } = model;

    let template = '<p>Bonjour,</p>';
    template += '<p>Il y a du nouveau du côté de <a href="http://centralamerica.recontact.me/#">Recontact Me</a>.</p>';
    template += '<p>';
    if (addedArticles.length === 1) {
      template += 'Un nouvel article :';
    } else {
      template += `${addedArticles.length} nouveaux articles :`;
    }
    template += '<ul>';
    addedArticles.forEach((article) => {
      template += `<li><a href="http://centralamerica.recontact.me/#/articles/${article.dropboxId}">${article.dropboxId}</a></li>`;
    });
    template += '</ul>';
    template += '</p>';
    return template;
  },
};
