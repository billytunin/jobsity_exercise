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
          <span>{{ getRemindersByDate(dayObject.dateFormatted) }}</span>
        </div>
        <div class="column is-half is-paddingless">
          <div class="is-pulled-right">
            <b-icon
              pack="ionicons"
              icon="add-circle"
              @click.native="showAddReminderModal"
            ></b-icon>
            <b-icon
              pack="ionicons"
              icon="remove-circle"
              @click.native="confirmRemoveAllReminders"
            ></b-icon>
          </div>
        </div>

        <!-- Reminders listing -->
        <div class="column is-12 is-paddingless is-marginless">
          <span class="reminder-summary">Task 1</span>
        </div>
        <div class="column is-12 is-paddingless is-marginless">
          <span class="reminder-summary">Task 2</span>
        </div>
        <div class="column is-12 is-paddingless is-marginless">
          <span class="reminder-summary">Task 3</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { DATE_FORMAT } from '~/utils/constants'

export default {
  name: 'CalendarTile',
  props: {
    dayObject: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('reminders', ['getRemindersByDate']),
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
    confirmRemoveAllReminders() {
      this.$buefy.dialog.confirm({
        title: 'Privacy Politics',
        message: `Are you sure you want to remove all reminders from ${this.dayObject.formatted}?`,
        confirmText: 'Confirm',
        type: 'is-danger',
        onConfirm: () => this.removeAllReminders()
      })
    },
    removeAllReminders() {
      // Do the thing
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
  border: 1px solid black;
}
.reminder-summary {
  font-size: 0.7rem;
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
