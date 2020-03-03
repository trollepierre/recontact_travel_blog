const { formatWithOptions } = require('date-fns/fp')
const { fr } = require('date-fns/locale')

const options = { locale: fr }
const formatDate = formatWithOptions(options)

const formatDateWithLongEndianLongFormat = date => date == null ? '' : formatDate('dd/MM/yyyy HH:mm')(date)

export {
  formatDateWithLongEndianLongFormat,
}
