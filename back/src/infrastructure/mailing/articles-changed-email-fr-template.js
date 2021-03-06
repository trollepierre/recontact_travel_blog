export default {
  compile(model) {
    const { addedArticles } = model

    let template = '<p>Bonjour,</p>'
    template += '<p>Il y a du nouveau du côté de <a href="https://fr.recontact.me/#">Recontact Me</a>.</p>'
    template += '<p>'
    if (addedArticles.length === 1) {
      template += 'Un nouvel article : '
    } else {
      template += `${addedArticles.length} nouveaux articles : `
    }
    addedArticles.sort((a, b) => a.dropboxId - b.dropboxId)
    addedArticles.forEach(article => {
      template += `<a href="https://fr.recontact.me/articles/${article.dropboxId}">${article.frTitle}</a>`
    })
    template += '</p>'
    return template
  },
}
