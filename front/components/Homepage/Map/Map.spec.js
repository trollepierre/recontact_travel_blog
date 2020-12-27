import Map from '@/components/Homepage/Map/Map';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: jest.fn(),
  Marker: jest.fn().mockReturnValue({
    setLngLat: jest.fn().mockReturnValue({
      setPopup: jest.fn().mockReturnValue({
        addTo: jest.fn().mockReturnValue({}),
      }),
    }),
  }),
  Popup: jest.fn().mockReturnValue({
    setHTML: jest.fn().mockReturnValue({ on: jest.fn() }),
  }),
}));

describe('Map', () => {
  it('should match snapshot', () => {
    // When
    const wrapper = shallowMount(Map);

    // Then
    expect(wrapper).toMatchSnapshot();
  });
});
