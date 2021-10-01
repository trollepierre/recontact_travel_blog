const dummySimpleArticle = article => ({
  dropboxId: '47',
  imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?raw=1',
  frTitle: '59. Perdus',
  enTitle: '59. Lost',
  ...article,
})

const dummyArticleFromDb = article => dummySimpleArticle({
  id: 14,
  createdAt: '2017-10-25T21:39:18.034Z',
  updatedAt: '2017-10-25T21:39:18.034Z',
  ...article,
})

const dummyArticleMeta = article => ({
  dropboxId: '47',
  frTitle: '59. Perdus',
  enTitle: '59. Lost',
  chaptersCount: 4,
  brokenImgDropboxId: [],
  photosCount: 8,
  ...article,
})

export {
  dummyArticleFromDb,
  dummySimpleArticle,
  dummyArticleMeta,
}
