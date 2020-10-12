<template>
  <div>
    <div class="has-text-centered">
      <span>{{ dayName }}</span>
    </div>
    <calendar-tile v-for="day in days" :key="day.formatted" :day-object="day" />
  </div>
</template>
<script>
import { mapState } from 'vuex'

import CalendarTile from '~/components/calendar-tile'

export default {
  name: 'CalendarColumn',
  components: { CalendarTile },
  props: {
    weekDayNumber: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('calendar', { stateDays: 'days', weekDaysMap: 'weekDaysMap' }),
    days() {
      // Return only the days for this weekday
      return this.stateDays.filter(
        day => day.weekDayNumber === this.weekDayNumber
      )
    },
    dayName() {
      return this.weekDaysMap.find(
        weekDayObj => weekDayObj.number === this.weekDayNumber
      ).name
    }
  }
}
</script>
