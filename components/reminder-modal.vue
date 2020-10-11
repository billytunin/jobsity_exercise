<template>
  <b-modal :active.sync="modalActive">
    <div class="reminder-modal">
      <div class="reminder-modal-title">
        <span>{{ completeDisplayName }}</span>
      </div>
      <b-field
        label="Reminder"
        :type="reminderTextError ? 'is-danger' : null"
        :message="reminderTextError"
      >
        <b-input v-model="reminderText" type="text" maxlength="30" />
      </b-field>
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

      <b-button type="is-success" @click="addReminder">Add</b-button>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { TIME_FORMAT } from '~/utils/constants'

export default {
  name: 'ReminderModal',
  mixins: [validationMixin],
  computed: {
    ...mapState('reminderModal', [
      'reminderData',
      'datePartAsString',
      'completeDisplayName'
    ]),
    modalActive: {
      get() {
        return this.$store.state.reminderModal.active
      },
      set(newFlag) {
        this.$store.commit('reminderModal/toggleActive', newFlag)
      }
    },
    reminderText: {
      get() {
        return this.reminderData.reminderText
      },
      set(newText) {
        this.$store.commit('reminderModal/setReminderText', newText)
      }
    },
    color: {
      get() {
        return this.reminderData.color
      },
      set(newColor) {
        this.$store.commit('reminderModal/setReminderColor', newColor)
      }
    },
    time: {
      get() {
        return this.reminderData.time
      },
      set(newTime) {
        this.$store.commit('reminderModal/setReminderTime', newTime)
      }
    },
    city: {
      get() {
        return this.reminderData.city
      },
      set(newCity) {
        this.$store.commit('reminderModal/setReminderCity', newCity)
      }
    },
    reminderTextError() {
      return this.$v.reminderText.$invalid && this.$v.reminderText.$dirty
        ? 'Reminder text is required'
        : null
    }
  },
  methods: {
    addReminder() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }

      this.$store.commit('reminders/addReminder', {
        reminderObj: {
          reminderText: this.reminderText,
          color: this.color,
          city: this.city,
          dateTime: `${this.datePartAsString}T${moment(this.time).format(
            TIME_FORMAT
          )}`
        },
        date: this.datePartAsString
      })

      this.modalActive = false
      this.$v.$reset()
    }
  },
  validations: {
    reminderText: {
      required
    }
  }
}
</script>

<style scoped>
.reminder-modal {
  padding: 0.75rem 1rem 1rem 1rem;
  background-color: white;
}
</style>
