<template>
  <div>
    <div class="has-text-centered">
      <span>{{ monthName }}</span>
    </div>
    <div class="columns">
      <div
        v-for="weekDayNumber in weekDayNumbers"
        :key="weekDayNumber"
        class="column is-paddingless"
      >
        <calendar-column :week-day-number="weekDayNumber" />
      </div>
    </div>
    <reminder-modal />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CalendarColumn from '~/components/calendar-column'
import ReminderModal from '~/components/reminder-modal'

export default {
  name: 'Calendar',
  components: { CalendarColumn, ReminderModal },
  computed: {
    ...mapState('calendar', ['weekDaysMap', 'monthName']),
    weekDayNumbers() {
      return this.weekDaysMap.map(weekDayObj => weekDayObj.number)
    }
  }
}
</script>
