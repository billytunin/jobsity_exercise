<template>
  <div class="weather-info-container extra-margin-bottom">
    <p class="has-text-centered">Weather</p>
    <b-loading v-model="weather.loading" :is-full-page="false"></b-loading>
    <div v-if="weather.loading === false">
      <span v-if="!weather.forecast">
        No data available for this date and/or city
      </span>
      <div v-else class="columns is-multiline has-text-centered weather-box">
        <div class="column is-12">
          <span class="main-caption">{{ weather.forecast.mainCaption }}</span>
          <span class="description-caption">{{
            weather.forecast.descriptionCaption
          }}</span>
        </div>
        <div class="column is-half">
          <span test-id="min-span">
            MIN: {{ weather.forecast.min }}°{{
              weatherUnits === FAHRENHEIT_STRING ? 'F' : 'C'
            }}
          </span>
        </div>
        <div class="column is-half">
          <span test-id="max-span">
            MAX: {{ weather.forecast.max }}°{{
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
import { mapState, mapActions } from 'vuex'
import { debounce } from 'lodash'
import { FAHRENHEIT_STRING } from '~/utils/constants'

export default {
  name: 'WeatherBox',
  props: {
    city: {
      type: String,
      default: null
    },
    date: {
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
      }
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
    }, 300)
  },
  mounted() {
    this.loadWeather()
  },
  methods: {
    ...mapActions('weather', ['loadWeatherForCityByDate']),
    async loadWeather() {
      this.weather.loading = true
      this.weather.forecast = await this.loadWeatherForCityByDate({
        city: this.city,
        date: this.date
      })
      this.weather.loading = false
    }
  }
}
</script>

<style scoped>
.main-caption {
  display: block;
}
.description-caption {
  font-size: 0.9rem;
  font-style: italic;
}
.weather-box {
  width: 50%;
  margin: auto;
}
.weather-info-container {
  position: relative;
  min-height: 60px;
}
.weather-info-container p {
  font-size: 1.3rem;
}
</style>
