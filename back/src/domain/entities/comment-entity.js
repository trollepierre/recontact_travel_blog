import { formatDateWithLongEndianLongFormat } from '../utils/date-utils'

export const enhanceComment = commentFromDb => {
  return {
    dropboxId: commentFromDb.dropboxId,
    text: commentFromDb.text,
    author: commentFromDb.author,
    createdAt: formatDateWithLongEndianLongFormat(new Date(commentFromDb.createdAt)),
  }
}
