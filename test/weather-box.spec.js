import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

import WeatherBox from '@/components/weather-box'

import { FAHRENHEIT_STRING } from '~/utils/constants'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Weather Box', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        weather: {
          namespaced: true,
          state: () => ({ units: FAHRENHEIT_STRING })
        }
      }
    })
  })

  test('span elements render weather info correctly based on props', () => {
    const propsData = {
      weatherForecast: {
        mainCaption: 'Sunny',
        descriptionCaption: 'clear sky',
        min: 23,
        max: 24,
        humidity: 32
      }
    }

    const wrapper = shallowMount(WeatherBox, {
      store,
      localVue,
      propsData
    })
    const minSpanText = wrapper.find('span[test-id="min-span"]').text()
    const maxSpanText = wrapper.find('span[test-id="max-span"]').text()
    const mainCaptionText = wrapper.find('span.main-caption').text()

    expect(mainCaptionText).toEqual(propsData.weatherForecast.mainCaption)
    expect(minSpanText).toEqual(`MIN: ${propsData.weatherForecast.min}°F`)
    expect(maxSpanText).toEqual(`MAX: ${propsData.weatherForecast.max}°F`)
  })
})
