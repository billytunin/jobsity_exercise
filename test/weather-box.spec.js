import { mount } from '@vue/test-utils'
import WeatherBox from '@/components/weather-box'

describe('Weather Box', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(WeatherBox, {
      propsData: {
        weatherForecast: {
          mainCaption: 'Sunny',
          descriptionCaption: 'clear sky',
          min: 23,
          max: 24,
          humidity: 32
        }
      }
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
