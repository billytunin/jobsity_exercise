<template>
  <b-modal :active.sync="modalActive">
    <div class="reminder-modal">
      <b-field label="Reminder">
        <b-input v-model="reminderText" />
      </b-field>
      <p v-show="reminderTextIsTooLong" class="long-text-error">
        Maximum length for the reminder is 30 characters
      </p>
      <b-field label="Time">
        <b-timepicker
          v-model="time"
          rounded
          placeholder="Click to select..."
          icon="time"
        />
      </b-field>
      <b-field label="Color">
        <b-select v-model="color">
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </b-select>
      </b-field>
      <b-field label="City">
        <b-input v-model="city" placeholder="(Optional)" />
      </b-field>

      <b-button
        type="is-success"
        :disabled="reminderTextIsTooLong"
        @click="addReminder"
      >
        Add
      </b-button>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { TIME_FORMAT } from '~/utils/dateTimeStandards'

export default {
  name: 'ReminderModal',
  data() {
    return {
      reminderText: null,
      color: null,
      city: null,
      time: null
    }
  },
  computed: {
    modalActive: {
      get() {
        return this.$store.state.reminderModal.active
      },
      set(newFlag) {
        this.$store.commit('reminderModal/toggleActive', newFlag)
      }
    },
    reminderTextIsTooLong() {
      return this.reminderText && this.reminderText.length > 30
    }
  },
  methods: {
    addReminder() {
      this.$store.commit('reminders/addReminder', {
        reminderObj: {
          reminderText: this.reminderText,
          color: this.color,
          city: this.city,
          dateTime: `${
            this.$store.state.reminderModal.datePartAsString
          }T${moment(this.time).format(TIME_FORMAT)}`
        },
        date: this.$store.state.reminderModal.datePartAsString
      })
    }
  }
}
</script>

<style scoped>
.reminder-modal {
  padding: 0.75rem 1rem 1rem 1rem;
  background-color: white;
}
.long-text-error {
  margin-bottom: 1rem;
  color: rgba(220, 20, 20, 0.8);
}
</style>
