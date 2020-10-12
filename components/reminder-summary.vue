<template>
  <div
    :style="reminderStyle"
    class="reminder-summary"
    @click="showEditReminderModal(reminder)"
  >
    <div class="columns is-marginless">
      <div class="column is-paddingless is-3">
        <span>{{ formatToTime(reminder.dateTime) }}</span>
      </div>
      <div class="column is-paddingless is-8 reminder-text-container">
        <span>{{ reminder.reminderText }}</span>
      </div>
      <div class="column is-paddingless is-1">
        <b-icon
          pack="ionicons"
          icon="trash"
          @click.native="confirmRemoveReminder($event, reminder.dateTime)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapActions } from 'vuex'

import { DATETIME_FORMAT, DISPLAY_TIME_FORMAT } from '~/utils/constants'

export default {
  name: 'ReminderSummary',
  props: {
    reminder: {
      type: Object,
      required: true
    },
    dayDisplayName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      reminderStyle: {
        backgroundColor: this.reminder.color
      }
    }
  },
  watch: {
    'reminder.color': {
      handler(newValue) {
        this.reminderStyle.backgroundColor = newValue
      }
    }
  },
  methods: {
    ...mapActions('reminders', ['removeReminder']),
    showEditReminderModal(reminder) {
      this.$store.commit('reminderModal/showEditReminderModal', {
        reminderObj: reminder,
        completeDisplayName: this.dayDisplayName
      })
    },
    formatToTime(dateTimeString) {
      return moment(dateTimeString, DATETIME_FORMAT).format(DISPLAY_TIME_FORMAT)
    },
    confirmRemoveReminder(event, reminderDateTime) {
      event.stopPropagation()
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to remove this reminder?',
        confirmText: 'Confirm',
        type: 'is-danger',
        onConfirm: () => this.removeReminder({ dateTime: reminderDateTime })
      })
    }
  }
}
</script>

<style scoped>
.reminder-summary {
  font-size: 0.8rem;
}
.reminder-text-container {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
