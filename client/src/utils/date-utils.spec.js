const lolex = require('lolex')
const { numberOfDaysInLate, formatDateWithInternationalLongDateTimeFormat, formatDateWithLongEndianLongFormat, isValid, determineNextBirthday, earliestDate, isToday, latestDate, parseDate, today, formatDateWithLittleEndianLongFormat } = require('./date-utils')

describe('Unit | Utils | date-utils', () => {
  const now = '2018-07-21T10:00:00'
  let clock

  beforeEach(() => {
    clock = lolex.install({ now: new Date(now).valueOf() })
  })

  afterEach(() => {
    clock.uninstall()
  })

  describe('#numberOfDaysInLate', () => {
    it('should', () => {
      // Given
      const date = new Date('2018-07-11T10:00:00')

      // When
      const numberOfDays = numberOfDaysInLate(date)

      // Then
      expect(numberOfDays).toEqual(10)
    })
  })

  xdescribe('#parseDate', () => {
    it('should return a date from a string DD/MM/YYYY', () => {
      // Given
      const dateString = '20/03/2018'

      // When
      const parsedDate = parseDate(dateString)

      // Then
      expect(parsedDate).toEqual(new Date('2018-03-20'))
    })
  })

  describe('#formatDateWithLittleEndianLongFormat', () => {
    it('should return a string with date format dd/MM/yyyy', () => {
      // Given
      const date = new Date('2018-01-22')

      // When
      const formattedDate = formatDateWithLittleEndianLongFormat(date)

      // Then
      expect(formattedDate).toEqual('22/01/2018')
    })

    it('should return empty string with date null', () => {
      // Given
      const date = null

      // When
      const formattedDate = formatDateWithLittleEndianLongFormat(date)

      // Then
      expect(formattedDate).toEqual('')
    })
  })

  describe('#formatDateWithLongEndianLongFormat', () => {
    it('should return a string with date format dd/MM/yyyy', () => {
      // Given
      const date = new Date('2018-01-22')

      // When
      const formattedDate = formatDateWithLongEndianLongFormat(date)

      // Then
      expect(formattedDate).toEqual('22/01/2018 01:00')
    })

    it('should return empty string with date null', () => {
      // Given
      const date = null

      // When
      const formattedDate = formatDateWithLongEndianLongFormat(date)

      // Then
      expect(formattedDate).toEqual('')
    })
  })

  describe('#formatDateWithInternationalLongDateTimeFormat', () => {
    it('should return a string with date format yyyy-MM-dd:HH:mm:ss', () => {
      // Given
      const date = new Date('2018-01-22T03:24:00')

      // When
      const formattedDate = formatDateWithInternationalLongDateTimeFormat(date)

      // Then
      expect(formattedDate).toEqual('2018-01-22:03:24:00')
    })
  })

  describe('#earliestDate', () => {
    it('should return earliest date between two', () => {
      // Given
      const oldDate = new Date('2018-01-22')
      const recentDate = new Date('2019-01-22')

      // When
      const earlierDate = earliestDate(oldDate, recentDate)
      const sameDate = earliestDate(recentDate, oldDate)

      // Then
      expect(earlierDate).toEqual(oldDate)
      expect(sameDate).toEqual(oldDate)
    })
  })

  describe('#latestDate', () => {
    it('should return latest date between two', () => {
      // Given
      const oldDate = new Date('2018-01-22')
      const recentDate = new Date('2019-01-22')

      // When
      const laterDate = latestDate(oldDate, recentDate)
      const sameDate = latestDate(recentDate, oldDate)

      // Then
      expect(laterDate).toEqual(recentDate)
      expect(sameDate).toEqual(recentDate)
    })
  })

  describe('#today', () => {
    it('should return today in format dd/MM/yyyy', () => {
      // When
      const returnedToday = today()

      // Then
      expect(returnedToday).toEqual('21/07/2018')
    })
  })

  describe('#isToday', () => {
    it('should return true when date is today', () => {
      // When
      const answer = isToday(new Date())

      // Then
      expect(answer).toEqual(true)
    })

    it('should return false when date is not today', () => {
      // When
      const answer = isToday(new Date('2018-12-15'))

      // Then
      expect(answer).toEqual(false)
    })
  })

  describe('#isValid', () => {
    it('should return false when date is invalid', () => {
      // When
      const answer = isValid(new Date(''))

      // Then
      expect(answer).toEqual(false)
    })

    it('should return true when date is valid', () => {
      // When
      const answer = isValid(new Date('2018-12-15'))

      // Then
      expect(answer).toEqual(true)
    })
  })

  describe('#determineNextBirthday', () => {
    xit('should return next birthday incoming in the same year', () => {
      // When
      const nextBirthday = determineNextBirthday(new Date('1991-10-19'))

      // Then
      expect(nextBirthday).toEqual(new Date('2018-10-19'))
    })

    it('should return next birthday incoming in the following year when birthday passed', () => {
      // When
      const nextBirthday = determineNextBirthday(new Date('1991-01-19'))

      // Then
      expect(nextBirthday).toEqual(new Date('2019-01-19'))
    })

    it('should return today when birthday is today', () => {
      // When
      const nextBirthday = determineNextBirthday(new Date('1991-07-21'))

      // Then
      expect(nextBirthday).toEqual(new Date('2018-07-21'))
    })
  })
})

