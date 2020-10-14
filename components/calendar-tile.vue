<template>
  <div
    class="calendar-tile columns is-multiline is-marginless"
    :class="{
      'is-from-another-month': isFromAnotherMonth,
      'is-today': isToday
    }"
  >
    <div class="column is-12 is-paddingless">
      <div class="columns is-marginless is-multiline">
        <div class="column is-half is-paddingless">
          <div class="month-number-container">
            <span
              :class="{
                'month-number-span': true,
                'is-sunday-or-saturday': isSundayOrSaturday,
                'is-today': isToday
              }"
            >
              {{ dayObject.monthNumber }}
            </span>
          </div>
        </div>
        <div class="column is-half is-paddingless">
          <div class="action-buttons-container is-pulled-right">
            <b-icon
              class="cursor-is-pointer"
              size="is-medium"
              pack="ionicons"
              icon="add-circle"
              @click.native="showAddReminderModal"
            />
            <b-icon
              class="cursor-is-pointer"
              :class="{ 'remove-all-disabled': !reminders.length }"
              size="is-medium"
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
    },
    isToday() {
      return moment().format(DATE_FORMAT) === this.dayObject.dateFormatted
    }
  },
  methods: {
    ...mapMutations('reminders', ['removeAllReminders']),
    confirmRemoveAllReminders() {
      if (!this.reminders.length) {
        return
      }

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

<style scoped lang="scss">
@import '@/assets/scss/global.scss';

.calendar-tile {
  height: 120px;
  overflow-y: scroll;
  width: 13.9vw;
  border-bottom: $general-borders;
  background-color: rgba(180, 180, 180, 0.6);
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &.is-today {
    box-shadow: inset 0px 30px 30px -20px rgba(240, 53, 53, 0.3);
  }
}
.calendar-tile::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
.month-number-container {
  margin-bottom: 8px;
  padding-left: 0.75rem;
  font-size: 1.5rem;
}
.month-number-span {
  font-weight: 800;
  &.is-today {
    color: rgba(167, 24, 24, 0.8);
  }
}
.is-sunday-or-saturday {
  color: rgba(0, 0, 230, 0.9);
}
.is-from-another-month {
  background-color: rgba(140, 140, 140, 0.75);
  .month-number-span {
    color: rgba(234, 234, 234, 0.8);
  }
}
.action-buttons-container {
  padding-top: 2px;
  padding-right: 2px;
}
.remove-all-disabled {
  opacity: 0.5;
}
</style>
