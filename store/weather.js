import moment from 'moment'
import {
  OPENWEATHER_API_KEY,
  DATE_FORMAT,
  FAHRENHEIT_STRING,
  OPENWEATHER_URL,
  OPENWEATHER_ONECALL_URL
} from '~/utils/constants'

export const state = () => ({
  units: FAHRENHEIT_STRING,
  weatherByCity: {}
})

export const actions = {
  async loadWeatherForCityByDate({ state, commit, dispatch }, { city, date }) {
    if (!city) {
      return null
    }

    city = city.toLowerCase()
    if (state.weatherByCity[city]) {
      return state.weatherByCity[city][date] || null
    }

    try {
      const dailyForecasts = await dispatch('getWeather', {
        city,
        reportType: 'daily'
      })
      const cityForecasts = {}
      const today = moment()
      dailyForecasts.forEach(dailyForecast => {
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
  },
  async loadWeatherForCityByHour({ dispatch }, { city, dateTime }) {
    if (!city) {
      return null
    }

    try {
      const hourlyForecasts = await dispatch('getWeather', {
        city: city.toLowerCase(),
        reportType: 'hourly'
      })

      const foundForecast = hourlyForecasts.find(hourlyForecast =>
        moment
          .unix(hourlyForecast.dt)
          .isSame(moment(dateTime).startOf('hour'), 'minute')
      )
      return foundForecast
        ? {
            humidity: foundForecast.humidity,
            temp: foundForecast.temp,
            mainCaption: foundForecast.weather[0].main,
            descriptionCaption: foundForecast.weather[0].description
          }
        : null
    } catch (error) {
      return null
    }
  },
  async getWeather({ state }, { city, reportType }) {
    const cityParam = encodeURI(city)

    // First, get the coordinates for the city
    const resp = await this.$axios(
      `${OPENWEATHER_URL}?q=${cityParam}&appid=${OPENWEATHER_API_KEY}`
    )
    const lat = resp.data.coord.lat
    const lon = resp.data.coord.lon

    // Setup what parameters to exclude in the API call
    const excludeString = `current,minutely,alerts,${
      reportType === 'daily' ? 'hourly' : 'daily'
    }`

    // Then, get the actual forecasts
    const forecasts = await this.$axios(
      `${OPENWEATHER_ONECALL_URL}?lat=${lat}&lon=${lon}&units=${state.units}&exclude=${excludeString}&appid=${OPENWEATHER_API_KEY}`
    )

    if (reportType === 'daily') {
      return forecasts.data.daily
    } else {
      return forecasts.data.hourly
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
