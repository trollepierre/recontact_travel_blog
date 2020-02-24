// const lolex = require('lolex')
// const { formatDateWithLongEndianLongFormat } = require('./date-utils')
//
// describe('Unit | Utils | date-utils', () => {
//   const now = '2018-07-21T10:00:00'
//   let clock
//
//   beforeEach(() => {
//     clock = lolex.install({ now: new Date(now).valueOf() })
//   })
//
//   afterEach(() => {
//     clock.uninstall()
//   })
//
//   describe('#formatDateWithLongEndianLongFormat', () => {
//     it('should return a string with date format dd/MM/yyyy', () => {
//       // Given
//       const date = new Date('2018-01-22')
//
//       // When
//       const formattedDate = formatDateWithLongEndianLongFormat(date)
//
//       // Then
//       expect(formattedDate).toEqual('22/01/2018 01:00')
//     })
//
//     it('should return empty string with date null', () => {
//       // Given
//       const date = null
//
//       // When
//       const formattedDate = formatDateWithLongEndianLongFormat(date)
//
//       // Then
//       expect(formattedDate).toEqual('')
//     })
//
//     it('should handle comments from CommentCard', () => {
//       // Given
//       const date = new Date('2020-01-15T12:26:45.887Z')
//       // When
//       const formattedDate = formatDateWithLongEndianLongFormat(date)
//
//       // Then
//       expect(formattedDate).toEqual('15/01/2020 13:26')
//     })
//   })
// })
//
