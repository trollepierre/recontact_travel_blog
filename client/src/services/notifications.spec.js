import notificationsService from './notifications';

describe('Unit | services | notifications', () => {
  beforeEach(() => {
    notificationsService.toaster = jest.fn()
  });

  describe('#success', () => {
    it('should call s method', (done) => {
      // given
      notificationsService.toaster.mockReturnValue({
        s(message) {
          if (message === 'message') {
            return done();
          }
          return 'erreur';
        },
      });
      const component = {};

      // when
      notificationsService.success(component, 'message');
    });

    it('should call toaster with component', () => {
      // given
      notificationsService.toaster.mockReturnValue({
        s() {
        },
      });
      const component = {};

      // when
      notificationsService.success(component, 'message');

      // then
      expect(notificationsService.toaster).toHaveBeenCalledWith(component);
    });
  });

  describe('#error', () => {
    it('should call e method', (done) => {
      // given
      notificationsService.toaster.mockReturnValue({
        e(message) {
          if (message === 'message') {
            return done();
          }
          return 'erreur';
        },
      });
      const component = {};

      // when
      notificationsService.error(component, 'message');
    });

    it('should call toaster with component', () => {
      // given
      notificationsService.toaster.mockReturnValue({
        e() {
        },
      });
      const component = {};

      // when
      notificationsService.error(component, 'message');

      // then
      expect(notificationsService.toaster).toHaveBeenCalledWith(component);
    });
  });

  describe('#information', () => {
    it('should call s method', (done) => {
      // given
      notificationsService.toaster.mockReturnValue({
        i(options) {
          if (options.msg === 'message' && options.timeout === 30000) {
            return done();
          }
          return 'erreur';
        },
      });
      const component = {};

      // when
      notificationsService.information(component, 'message');
    });

    it('should call toaster with component', () => {
      // given
      notificationsService.toaster.mockReturnValue({
        i() {
        },
      });
      const component = {};

      // when
      notificationsService.information(component, 'message');

      // then
      expect(notificationsService.toaster).toHaveBeenCalledWith(component);
    });
  });

  describe('#removeInformation', () => {
    it('should call s method', (done) => {
      // given
      notificationsService.toaster.mockReturnValue({
        removeByType(type) {
          if (type === 'info') return done();
          return 'erreur';
        },
      });
      const component = {};

      // when
      notificationsService.removeInformation(component, 'message');
    });

    it('should call toaster with component', () => {
      // given
      notificationsService.toaster.mockReturnValue({
        removeByType() {
        },
      });
      const component = {};

      // when
      notificationsService.removeInformation(component, 'message');

      // then
      expect(notificationsService.toaster).toHaveBeenCalledWith(component);
    });
  });
});
