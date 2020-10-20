<template>
  <div
    :style="reminderStyle"
    class="reminder-summary cursor-is-pointer"
    @click="showEditReminderModal(reminder)"
  >
    <div class="columns is-marginless">
      <div class="column is-paddingless is-4">
        <div class="time-caption-container">
          <div class="time-caption has-text-centered">
            <span class="time-caption-text">{{
              formatToTime(reminder.dateTime)
            }}</span>
          </div>
        </div>
      </div>
      <div class="column is-paddingless is-6 reminder-text-container">
        <span>{{ reminder.text }}</span>
      </div>
      <div class="column is-paddingless is-2">
        <div class="remove-icon-container is-pulled-right">
          <b-button
            icon-right="close"
            size="is-small"
            type="is-danger"
            pack="ionicons"
            @click="
              confirmRemoveReminder($event, reminder.id, reminder.dateTime)
            "
          />
        </div>
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
    confirmRemoveReminder(event, id, dateTime) {
      event.stopPropagation()
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to remove this reminder?',
        confirmText: 'Confirm',
        type: 'is-danger',
        onConfirm: () => this.removeReminder({ id, dateTime })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/global.scss';

.reminder-summary {
  font-size: 0.8rem;
}
.reminder-text-container {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Roboto';
  padding-top: 12px !important;
}
.time-caption-container {
  display: table;
  height: 100%;
  width: 100%;
}
.time-caption {
  font-size: 0.7rem;
  display: table-cell;
  vertical-align: middle;
}
.time-caption-text {
  border-radius: 8px;
  padding: 1px 3px 1px 3px;
  background-color: $general-bg-color;
}
.remove-icon-container {
  padding: 8px;
}
@media (max-width: 1231px) {
  .time-caption {
    font-size: 0.6rem;
  }
}
</style>
