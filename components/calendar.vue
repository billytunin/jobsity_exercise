<template>
  <div>
    <div class="columns">
      <div class="column is-one-third"></div>
      <div class="column is-one-third has-text-centered">
        <b-select v-model="currentMonth" rounded size="is-medium">
          <option
            v-for="monthName in monthNames"
            :key="monthName"
            :value="monthName"
          >
            {{ monthName }}
          </option>
        </b-select>
      </div>
      <div class="column is-one-third">
        <div class="is-pulled-right units-selector-container">
          <b-field>
            <b-radio-button
              v-model="componentWeatherUnits"
              :native-value="FAHRENHEIT_STRING"
            >
              <span>Fahrenheit</span>
            </b-radio-button>
            <b-radio-button
              v-model="componentWeatherUnits"
              :native-value="CELSIUS_STRING"
            >
              <span>Celsius</span>
            </b-radio-button>
          </b-field>
        </div>
      </div>
    </div>
    <div class="columns calendar-columns-container">
      <div
        v-for="(weekDayNumber, index) in weekDayNumbers"
        :key="weekDayNumber"
        class="column is-paddingless is-narrow"
      >
        <calendar-column
          :week-day-number="weekDayNumber"
          :is-first-column="index === 0"
        />
      </div>
    </div>
    <reminder-modal />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CalendarColumn from '~/components/calendar-column'
import ReminderModal from '~/components/reminder-modal'

import { CELSIUS_STRING, FAHRENHEIT_STRING } from '~/utils/constants'

export default {
  name: 'Calendar',
  components: { CalendarColumn, ReminderModal },
  data() {
    return {
      CELSIUS_STRING,
      FAHRENHEIT_STRING
    }
  },
  computed: {
    ...mapState('calendar', ['weekDaysMap', 'months', 'monthName']),
    ...mapState('weather', { weatherUnits: 'units' }),
    currentMonth: {
      get() {
        return this.monthName
      },
      set(newValue) {
        this.setMonth(newValue)
      }
    },
    componentWeatherUnits: {
      get() {
        return this.weatherUnits
      },
      set(newUnits) {
        this.setWeatherUnits(newUnits)
      }
    },
    weekDayNumbers() {
      return this.weekDaysMap.map(weekDayObj => weekDayObj.number)
    },
    monthNames() {
      return Object.keys(this.months)
    }
  },
  methods: {
    ...mapMutations('weather', { setWeatherUnits: 'setUnits' }),
    ...mapMutations('calendar', ['setMonth'])
  }
}
</script>

<style scoped>
.units-selector-container {
  margin-top: 5px;
}
.calendar-columns-container {
  margin-top: 1.5rem;
}
</style>
