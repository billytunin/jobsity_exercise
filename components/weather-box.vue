<template>
  <div class="columns is-multiline has-text-centered weather-box">
    <div class="column is-12">
      <span class="main-caption">{{ weatherForecast.mainCaption }}</span>
      <span>{{ weatherForecast.descriptionCaption }}</span>
    </div>
    <div class="column is-half">
      <span>
        MIN: {{ weatherForecast.min }}°{{
          weatherUnits === FAHRENHEIT_STRING ? 'F' : 'C'
        }}
      </span>
    </div>
    <div class="column is-half">
      <span>
        MAX: {{ weatherForecast.max }}°{{
          weatherUnits === FAHRENHEIT_STRING ? 'F' : 'C'
        }}
      </span>
    </div>
    <div class="column is-12">
      <span>Humidity: {{ weatherForecast.humidity }}%</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { FAHRENHEIT_STRING } from '~/utils/constants'

export default {
  name: 'WeatherBox',
  props: {
    weatherForecast: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      FAHRENHEIT_STRING
    }
  },
  computed: {
    ...mapState('weather', { weatherUnits: 'units' })
  }
}
</script>

<style scoped>
.main-caption {
  display: block;
}
.weather-box {
  width: 50%;
  margin: auto;
}
</style>
