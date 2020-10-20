<template>
  <div class="weather-info-container extra-margin-bottom">
    <div class="has-text-centered">
      <span class="weather-title">Weather</span>
      <p v-show="weather.forecast" class="clarification">
        (for selected {{ isDayForecast ? 'day' : 'time' }})
      </p>
    </div>
    <b-loading v-model="weather.loading" :is-full-page="false"></b-loading>
    <div v-if="weather.loading === false" class="weather-body">
      <span v-if="!weather.forecast">
        No data available for this date and/or city
      </span>
      <div v-else class="columns is-multiline has-text-centered">
        <div class="column is-12">
          <span class="main-caption">{{ weather.forecast.mainCaption }}</span>
          <span class="description-caption">{{
            weather.forecast.descriptionCaption
          }}</span>
        </div>
        <template v-if="isDayForecast">
          <div class="column is-half">
            <span class="temp-span" test-id="min-span">
              MIN: {{ weather.forecast.min }}°{{
                weatherUnits === FAHRENHEIT_STRING ? 'F' : 'C'
              }}
            </span>
          </div>
          <div class="column is-half">
            <span class="temp-span" test-id="max-span">
              MAX: {{ weather.forecast.max }}°{{
                weatherUnits === FAHRENHEIT_STRING ? 'F' : 'C'
              }}
            </span>
          </div>
        </template>
        <div v-else class="column is-12">
          <span class="temp-span">
            TEMPERATURE: {{ weather.forecast.temp }}°{{
              weatherUnits === FAHRENHEIT_STRING ? 'F' : 'C'
            }}
          </span>
        </div>
        <div class="column is-12">
          <span>Humidity: {{ weather.forecast.humidity }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import { debounce } from 'lodash'
import {
  FAHRENHEIT_STRING,
  DATETIME_FORMAT,
  DATE_FORMAT
} from '~/utils/constants'

export default {
  name: 'WeatherBox',
  props: {
    city: {
      type: String,
      default: null
    },
    dateTime: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      FAHRENHEIT_STRING,
      weather: {
        loading: false,
        forecast: null
      },
      isDayForecast: true
    }
  },
  computed: {
    ...mapState('weather', { weatherUnits: 'units' })
  },
  watch: {
    city: debounce(function () {
      if (!this.weather.loading) {
        this.loadWeather()
      }
    }, 300),
    dateTime() {
      if (!this.weather.loading) {
        this.loadWeather()
      }
    }
  },
  mounted() {
    this.loadWeather()
  },
  methods: {
    ...mapActions('weather', [
      'loadWeatherForCityByDate',
      'loadWeatherForCityByHour'
    ]),
    async loadWeather() {
      this.weather.loading = true

      const dateTimeIsWithin48HoursForecasts = moment(
        this.dateTime,
        DATETIME_FORMAT
      ).isBetween(
        moment().startOf('hour'),
        moment().add(47, 'hours').startOf('hour'),
        'minute',
        '[]'
      )
      if (dateTimeIsWithin48HoursForecasts) {
        this.isDayForecast = false
        this.weather.forecast = await this.loadWeatherForCityByHour({
          city: this.city,
          dateTime: this.dateTime
        })
      } else {
        this.isDayForecast = true
        this.weather.forecast = await this.loadWeatherForCityByDate({
          city: this.city,
          date: moment(this.dateTime, DATETIME_FORMAT).format(DATE_FORMAT)
        })
      }
      this.weather.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
$border-radius: 4px;

.main-caption {
  display: block;
  font-size: 1.1rem;
}
.description-caption {
  font-size: 0.9rem;
  font-style: italic;
}
.weather-info-container {
  position: relative;
  min-height: 60px;
  margin-top: 2rem;
}
.weather-info-container .weather-title {
  font-size: 1.3rem;
  padding: 8px 15px 8px 15px;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  text-decoration: underline;
}
.weather-body {
  width: 35%;
  margin: auto;
  margin-top: 1.1rem;
  border-radius: $border-radius;
}
.temp-span {
  background-color: rgba(140, 140, 140, 0.8);
  color: white;
  padding: 0.3rem 1rem 0.3rem 1rem;
  border-radius: 15px;
}
.clarification {
  font-size: 0.7rem;
  font-style: italic;
}
</style>
