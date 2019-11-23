import analyticsService from './analytics-service'

describe('Unit | services | analytics', () => {
  describe('#sendAnalytics', () => {
    it('should analytics from google', () => {
      const component = { $ga: { event: jest.fn() } }
      const eventCategory = 'category'
      const eventAction = 'action'
      const eventLabel = 'label'

      analyticsService.sendAnalytics(component, eventCategory, eventAction, eventLabel)

      expect(component.$ga.event).toHaveBeenCalledWith({ eventCategory, eventAction, eventLabel })
    })
  })
})
