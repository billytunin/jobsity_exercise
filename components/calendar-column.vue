<template>
  <div>
    <div class="day-name-container has-text-centered">
      <span>{{ dayName }}</span>
    </div>
    <div
      class="calendar-tiles-container"
      :class="{
        'is-first-column': isFirstColumn
      }"
    >
      <calendar-tile
        v-for="day in days"
        :key="day.formatted"
        :day-object="day"
      />
    </div>
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
    },
    isFirstColumn: {
      type: Boolean,
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

<style scoped lang="scss">
@import '@/assets/scss/global.scss';

.day-name-container {
  padding: 1rem;
  background-color: $general-bg-color;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  font-size: 1.2rem;
}
.calendar-tiles-container {
  border-right: $general-borders;
  border-top: $general-borders;
}
.is-first-column {
  border-left: $general-borders;
}
</style>
