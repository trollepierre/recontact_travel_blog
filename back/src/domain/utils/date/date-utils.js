const { formatWithOptions } = require('date-fns/fp')
const { fr } = require('date-fns/locale')
const { ifElse, isNil } = require('ramda')

const options = { locale: fr }
const formatDate = formatWithOptions(options)

const formatDateWithLongEndianLongFormat = ifElse(isNil, () => '', formatDate('dd/MM/yyyy HH:mm'))

export {
  formatDateWithLongEndianLongFormat,
}
