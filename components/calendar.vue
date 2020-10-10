<template>
  <div>
    <div class="has-text-centered">
      <span>{{ monthName }}</span>
    </div>
    <div class="columns">
      <div
        v-for="weekDayNumber in weekDayNumbers"
        :key="weekDayNumber"
        class="column"
      >
        <calendar-column :week-day-number="weekDayNumber" />
      </div>
    </div>
    <b-modal></b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CalendarColumn from '~/components/calendar-column'

export default {
  name: 'Calendar',
  components: { CalendarColumn },
  computed: {
    ...mapState('calendar', ['weekDaysMap', 'monthName']),
    weekDayNumbers() {
      return this.weekDaysMap.map(weekDayObj => weekDayObj.number)
    }
  }
}
</script>
