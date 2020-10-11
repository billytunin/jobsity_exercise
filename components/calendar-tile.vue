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
            ></b-icon>
            <b-icon
              pack="ionicons"
              icon="remove-circle"
              @click.native="confirmRemoveAllReminders"
            ></b-icon>
          </div>
        </div>

        <!-- Reminders listing -->
        <div
          v-for="(reminder, index) in reminders"
          :key="`reminderText-${index}`"
          class="column is-12 is-paddingless is-marginless"
        >
          <div
            class="reminder-summary"
            @click="showEditReminderModal(reminder)"
          >
            <span class="reminder-time">{{
              formatToTime(reminder.dateTime)
            }}</span>
            <span class="reminder-text">{{ reminder.reminderText }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import {
  DATE_FORMAT,
  DATETIME_FORMAT,
  DISPLAY_TIME_FORMAT
} from '~/utils/constants'

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
    },
    showEditReminderModal(reminder) {
      this.$store.commit('reminderModal/showEditReminderModal', {
        reminderObj: reminder,
        completeDisplayName: this.dayObject.completeDisplayName
      })
    },
    formatToTime(dateTimeString) {
      return moment(dateTimeString, DATETIME_FORMAT).format(DISPLAY_TIME_FORMAT)
    }
  }
}
</script>

<style scoped>
.calendar-tile {
  height: 120px;
  width: 14vw;
  border: 1px solid black;
}
.reminder-summary {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.8rem;
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
.reminder-time {
  width: 20%;
}
.reminder-text {
  width: 80%;
}
</style>
