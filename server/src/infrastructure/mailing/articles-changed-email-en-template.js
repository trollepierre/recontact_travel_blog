export default {
  compile(model) {
    const { addedArticles } = model

    let template = '<p>Hello,</p>'
    template += '<p>There are some news on <a href="http://www.recontact.me/#">Recontact Me</a>.</p>'
    template += '<p>'
    if (addedArticles.length === 1) {
      template += 'One new article: '
    } else {
      template += `${addedArticles.length} new articles: `
    }
    addedArticles.sort((a, b) => a.dropboxId - b.dropboxId)
    addedArticles.forEach(article => {
      template += `<a href="http://www.recontact.me/articles/${article.dropboxId}">${article.enTitle}</a>`
    })
    template += '</p>'
    return template
  },
}
