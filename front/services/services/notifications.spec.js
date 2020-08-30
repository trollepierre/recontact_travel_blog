import notificationsService from './notifications'

describe('Unit | services | notifications', () => {
  const message = 'message'

  describe('#information', () => {
    it('should call console log', () => {
      console.log = jest.fn()

      notificationsService.information(message)

      expect(console.log).toHaveBeenCalledWith(message)
    })
  })

  describe('#error', () => {
    it('should call console log', () => {
      console.error = jest.fn()

      notificationsService.error(message)

      expect(console.error).toHaveBeenCalledWith(message)
    })

    it('should call alert', () => {
      console.error = jest.fn()
      window.alert = jest.fn()

      notificationsService.error(message)

      expect(window.alert).toHaveBeenCalledWith(message)
    })
  })

  describe('#warn', () => {
    it('should call console warn', () => {
      console.warn = jest.fn()

      notificationsService.warn(message)

      expect(console.warn).toHaveBeenCalledWith(message)
    })
  })
})
