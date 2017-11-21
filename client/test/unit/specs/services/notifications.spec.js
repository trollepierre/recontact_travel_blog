import notificationsService from '@/services/notifications';

describe('Unit | services | notifications', () => {
  let toaster;

  beforeEach(() => {
    toaster = sinon.stub(notificationsService, 'toaster');
  });

  afterEach(() => {
    toaster.restore();
  });

  describe('#success', () => {
    it('should call s method', (done) => {
      // given
      toaster.returns({
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
      toaster.returns({
        s() {
        },
      });
      const component = {};

      // when
      notificationsService.success(component, 'message');

      // then
      expect(toaster).to.have.been.calledWith(component);
    });
  });

  describe('#error', () => {
    it('should call e method', (done) => {
      // given
      toaster.returns({
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
      toaster.returns({
        e() {
        },
      });
      const component = {};

      // when
      notificationsService.error(component, 'message');

      // then
      expect(toaster).to.have.been.calledWith(component);
    });
  });

  describe('#information', () => {
    it('should call s method', (done) => {
      // given
      toaster.returns({
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
      toaster.returns({
        i() {
        },
      });
      const component = {};

      // when
      notificationsService.information(component, 'message');

      // then
      expect(toaster).to.have.been.calledWith(component);
    });
  });

  describe('#removeInformation', () => {
    it('should call s method', (done) => {
      // given
      toaster.returns({
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
      toaster.returns({
        removeByType() {
        },
      });
      const component = {};

      // when
      notificationsService.removeInformation(component, 'message');

      // then
      expect(toaster).to.have.been.calledWith(component);
    });
  });
});
