import moment from 'moment'
import {
  OPENWEATHER_API_KEY,
  DATE_FORMAT,
  FAHRENHEIT_STRING
} from '~/utils/constants'

export const state = () => ({
  units: FAHRENHEIT_STRING,
  weatherByCity: {}
})

export const actions = {
  async loadWeatherForCityByDate({ state, commit }, { city, date }) {
    if (!city) {
      return null
    }

    city = city.toLowerCase()
    if (state.weatherByCity[city]) {
      return state.weatherByCity[city][date] || null
    }

    try {
      const cityParam = encodeURI(city)
      // This call gets us the coordinates. Something we will need to provide to OpenWeatherAPI when asking
      // for next 7 day's forecast
      const resp = await this.$axios(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityParam}&appid=${OPENWEATHER_API_KEY}`
      )
      const lat = resp.data.coord.lat
      const lon = resp.data.coord.lon
      const dailyForecasts = await this.$axios(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${state.units}&exclude=current,minutely,hourly,alerts&appid=${OPENWEATHER_API_KEY}`
      )
      const cityForecasts = {}
      const today = moment()
      dailyForecasts.data.daily.forEach(dailyForecast => {
        cityForecasts[today.format(DATE_FORMAT)] = {
          min: dailyForecast.temp.min,
          max: dailyForecast.temp.max,
          humidity: dailyForecast.humidity,
          mainCaption: dailyForecast.weather[0].main,
          descriptionCaption: dailyForecast.weather[0].description
        }

        today.add(1, 'day')
      })

      commit('addCityData', { city, cityForecasts })
      return cityForecasts[date] || null
    } catch (error) {
      return null
    }
  }
}

export const mutations = {
  addCityData(state, { city, cityForecasts }) {
    state.weatherByCity[city] = cityForecasts
  },
  setUnits(state, newUnits) {
    state.weatherByCity = {}
    state.units = newUnits
  }
}
