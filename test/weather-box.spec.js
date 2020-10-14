import { shallowMount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Vuex from 'vuex'
import Buefy from 'buefy'

import WeatherBox from '@/components/weather-box'

import { state as weatherStoreState } from '~/store/weather'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Buefy)

describe('Weather Box', () => {
  let store
  const fakeWeather = {
    mainCaption: 'Sunny',
    descriptionCaption: 'clear sky',
    min: 23,
    max: 24,
    humidity: 32
  }

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        weather: {
          namespaced: true,
          state: weatherStoreState,
          actions: {
            loadWeatherForCityByDate() {
              return fakeWeather
            }
          }
        }
      }
    })
  })

  test('span elements render weather info correctly based on props', async () => {
    const propsData = {
      city: 'Tokyo',
      date: '2020-10-14'
    }

    const wrapper = shallowMount(WeatherBox, {
      store,
      localVue,
      propsData
    })

    await flushPromises()

    const minSpanText = wrapper.find('span[test-id="min-span"]').text()
    const maxSpanText = wrapper.find('span[test-id="max-span"]').text()
    const mainCaptionText = wrapper.find('span.main-caption').text()

    expect(mainCaptionText).toEqual(fakeWeather.mainCaption)
    expect(minSpanText).toEqual(`MIN: ${fakeWeather.min}°F`)
    expect(maxSpanText).toEqual(`MAX: ${fakeWeather.max}°F`)
  })
})
