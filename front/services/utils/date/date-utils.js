import { formatWithOptions } from 'date-fns/fp'

const differenceInYears = require('date-fns/fp/differenceInYears')
const differenceInCalendarDays = require('date-fns/fp/differenceInCalendarDays')
const addDays = require('date-fns/fp/addDays')
const isAfter = require('date-fns/fp/isAfter')
const isBefore = require('date-fns/fp/isBefore')
const isSameDay = require('date-fns/fp/isSameDay')
const subDays = require('date-fns/fp/subDays')
const addYears = require('date-fns/fp/addYears')
const { parse, isValid } = require('date-fns')

const { fr } = require('date-fns/locale')
const { ifElse, isNil } = require('ramda')

const options = { locale: fr }
const formatDate = formatWithOptions(options)

const numberOfDaysInLate = date => differenceInCalendarDays(date)(new Date())
const parseDate = date => parse(date, 'dd/MM/yyyy', new Date())
const formatDateWithLittleEndianLongFormat = ifElse(isNil, () => '', formatDate('dd/MM/yyyy'))
const formatDateWithLongEndianLongFormat = ifElse(isNil, () => '', formatDate('dd/MM/yyyy HH:mm'))
const formatDateWithInternationalLongDateTimeFormat = formatDate('yyyy-MM-dd:HH:mm:ss')
const earliestDate = (firstDate, secondDate) => isAfter(firstDate)(secondDate) ? firstDate : secondDate
const latestDate = (firstDate, secondDate) => isBefore(firstDate)(secondDate) ? firstDate : secondDate

const today = () => formatDateWithLittleEndianLongFormat(new Date())

const isToday = date => isSameDay(date)(new Date())

const determineNextBirthday = birthDate => {
  const age = differenceInYears(birthDate, new Date())
  const lastBirthday = addYears(age)(birthDate)
  return isToday(lastBirthday) ? lastBirthday : addYears(age + 1)(birthDate)
}

export {
  numberOfDaysInLate,
  parseDate,
  formatDateWithLittleEndianLongFormat,
  formatDateWithInternationalLongDateTimeFormat,
  formatDateWithLongEndianLongFormat,
  earliestDate,
  latestDate,
  addYears,
  addDays,
  subDays,
  today,
  determineNextBirthday,
  isToday,
  isValid,
}
