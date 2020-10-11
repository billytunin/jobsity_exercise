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
      <b-field
        label="Time"
        :type="timeIsAlreadyUsedError ? 'is-danger' : null"
        :message="timeIsAlreadyUsedError"
      >
        <b-timepicker
          v-model="dateTimeForTimepicker"
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

      <b-button type="is-success" @click="addReminder">{{
        isAddMode ? 'Add' : 'Edit'
      }}</b-button>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { DATETIME_FORMAT } from '~/utils/constants'

export default {
  name: 'ReminderModal',
  mixins: [validationMixin],
  data() {
    return {
      dateTimeForTimepicker: null
    }
  },
  computed: {
    ...mapState('reminderModal', [
      'reminderData',
      'completeDisplayName',
      'isAddMode',
      'originalDateTime'
    ]),
    ...mapGetters('reminders', ['locateReminderByDateTime']),
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
    dateTime: {
      get() {
        return this.reminderData.dateTime
      },
      set(newDateTime) {
        this.$store.commit('reminderModal/setReminderDateTime', newDateTime)
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
    },
    timeIsAlreadyUsedError() {
      const isOriginalDateTime = this.dateTime === this.originalDateTime
      return this.locateReminderByDateTime(this.dateTime) && !isOriginalDateTime
        ? 'This exact date and time has already been used by a reminder. Please pick another time'
        : null
    }
  },
  watch: {
    dateTime: {
      handler(newDateTime) {
        this.dateTimeForTimepicker = moment(newDateTime).toDate()
      },
      immediate: true
    },
    dateTimeForTimepicker: {
      handler(newTime) {
        this.dateTime = moment(newTime).format(DATETIME_FORMAT)
      }
    }
  },
  methods: {
    addReminder() {
      this.$v.$touch()
      if (this.$v.$invalid || this.timeIsAlreadyUsedError) {
        return
      }

      const reminderObj = {
        reminderText: this.reminderText,
        color: this.color,
        city: this.city,
        dateTime: this.dateTime
      }

      if (this.isAddMode) {
        this.$store.commit('reminders/addReminder', reminderObj)
      } else {
        this.$store.dispatch('reminders/editReminder', {
          reminderObj,
          originalDateTime: this.originalDateTime
        })
      }

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
