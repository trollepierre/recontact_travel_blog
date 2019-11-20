import notificationsService from './notifications'

describe('Unit | services | notifications', () => {
  beforeEach(() => {
    notificationsService.toaster = jest.fn()
  })

  describe('#success', () => {
    it('should call s method', done => {
      notificationsService.toaster.mockReturnValue({
        s(message) {
          if (message === 'message') {
            return done()
          }
          return 'erreur'
        },
      })
      const component = {}

      notificationsService.success(component, 'message')
    })

    it('should call toaster with component', () => {
      notificationsService.toaster.mockReturnValue({
        s() {
        },
      })
      const component = {}

      notificationsService.success(component, 'message')

      expect(notificationsService.toaster).toHaveBeenCalledWith(component)
    })
  })

  describe('#error', () => {
    it('should call e method', done => {
      notificationsService.toaster.mockReturnValue({
        e(message) {
          if (message === 'message') {
            return done()
          }
          return 'erreur'
        },
      })
      const component = {}

      notificationsService.error(component, 'message')
    })

    it('should call toaster with component', () => {
      notificationsService.toaster.mockReturnValue({
        e() {
        },
      })
      const component = {}

      notificationsService.error(component, 'message')

      expect(notificationsService.toaster).toHaveBeenCalledWith(component)
    })
  })

  describe('#information', () => {
    it('should call s method', done => {
      notificationsService.toaster.mockReturnValue({
        i(options) {
          if (options.msg === 'message' && options.timeout === 30000) {
            return done()
          }
          return 'erreur'
        },
      })
      const component = {}

      notificationsService.information(component, 'message')
    })

    it('should call toaster with component', () => {
      notificationsService.toaster.mockReturnValue({
        i() {
        },
      })
      const component = {}

      notificationsService.information(component, 'message')

      expect(notificationsService.toaster).toHaveBeenCalledWith(component)
    })
  })

  describe('#removeInformation', () => {
    it('should call s method', done => {
      notificationsService.toaster.mockReturnValue({
        removeByType(type) {
          if (type === 'info') {
            return done()
          }
          return 'erreur'
        },
      })
      const component = {}

      notificationsService.removeInformation(component, 'message')
    })

    it('should call toaster with component', () => {
      notificationsService.toaster.mockReturnValue({
        removeByType() {
        },
      })
      const component = {}

      notificationsService.removeInformation(component, 'message')

      expect(notificationsService.toaster).toHaveBeenCalledWith(component)
    })
  })
})
