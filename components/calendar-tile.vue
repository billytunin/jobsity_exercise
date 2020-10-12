<template>
  <div class="calendar-tile columns is-multiline is-marginless">
    <div class="column is-12 is-paddingless">
      <div class="columns is-marginless is-multiline">
        <div class="column is-half is-paddingless">
          <span
            :class="{
              'month-number-span': true,
              'is-from-another-month': isFromAnotherMonth,
              'is-sunday-or-saturday': isSundayOrSaturday
            }"
          >
            {{ dayObject.monthNumber }}
          </span>
        </div>
        <div class="column is-half is-paddingless">
          <div class="is-pulled-right">
            <b-icon
              pack="ionicons"
              icon="add-circle"
              @click.native="showAddReminderModal"
            />
            <b-icon
              pack="ionicons"
              icon="remove-circle"
              @click.native="confirmRemoveAllReminders"
            />
          </div>
        </div>

        <!-- Reminders listing -->
        <div
          v-for="(reminder, index) in reminders"
          :key="`reminder-${index}`"
          class="column is-12 is-paddingless is-marginless"
        >
          <reminder-summary
            :reminder="reminder"
            :day-display-name="dayObject.completeDisplayName"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import { DATE_FORMAT } from '~/utils/constants'

import ReminderSummary from '~/components/reminder-summary'

export default {
  name: 'CalendarTile',
  components: { ReminderSummary },
  props: {
    dayObject: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('reminders', ['getRemindersByDate']),
    reminders() {
      const remindersArray = [
        ...this.getRemindersByDate(this.dayObject.dateFormatted)
      ]
      return remindersArray.sort((a, b) => moment(a.dateTime).diff(b.dateTime))
    },
    isFromAnotherMonth() {
      return !moment(this.dayObject.dateFormatted, DATE_FORMAT).isBetween(
        moment().startOf('month'),
        moment().endOf('month'),
        'day',
        '[]'
      )
    },
    isSundayOrSaturday() {
      return (
        this.dayObject.weekDayNumber === 0 || this.dayObject.weekDayNumber === 6
      )
    }
  },
  methods: {
    ...mapMutations('reminders', ['removeAllReminders']),
    confirmRemoveAllReminders() {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to remove all reminders from ${this.dayObject.formatted}?`,
        confirmText: 'Confirm',
        type: 'is-danger',
        onConfirm: () => this.removeAllReminders(this.dayObject.dateFormatted)
      })
    },
    showAddReminderModal() {
      this.$store.commit('reminderModal/showAddReminderModal', {
        date: this.dayObject.dateFormatted,
        completeDisplayName: this.dayObject.completeDisplayName
      })
    }
  }
}
</script>

<style scoped>
.calendar-tile {
  height: 120px;
  overflow-y: scroll;
  width: 14vw;
  border: 1px solid black;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}
.calendar-tile::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
.month-number-span {
  font-weight: 800;
}
.is-sunday-or-saturday {
  color: rgba(0, 0, 230, 0.9);
}
.is-from-another-month {
  color: rgba(180, 180, 180, 0.8);
}
</style>
