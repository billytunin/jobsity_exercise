<template>
  <b-modal :active.sync="modalActive">
    <div class="reminder-modal">
      <div class="reminder-modal-title has-text-centered">
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
        label="Date & Time"
        class="extra-margin-bottom"
        :type="timeIsAlreadyUsedError ? 'is-danger' : null"
        :message="timeIsAlreadyUsedError"
      >
        <b-datetimepicker
          v-model="dateTimeForTimepicker"
          rounded
          placeholder="Click to select..."
          :min-datetime="currentCalendarFirstDateTime"
          :max-datetime="currentCalendarLastDateTime"
          icon="calendar"
        />
      </b-field>

      <b-field label="Color" class="extra-margin-bottom">
        <v-swatches v-model="color" :swatches="colorOptions"></v-swatches>
      </b-field>

      <b-field label="City" class="extra-margin-bottom">
        <b-input v-model="city" placeholder="(Optional)" />
      </b-field>

      <weather-box :city="city" :date="currentDate" />

      <div class="buttons is-right">
        <b-button type="is-success" @click="addOrEditReminder">
          {{ isAddMode ? 'Add' : 'Edit' }}
        </b-button>
        <b-button @click="cancel">Cancel</b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import WeatherBox from '~/components/weather-box'

import { DATETIME_FORMAT, DATE_FORMAT, COLOR_OPTIONS } from '~/utils/constants'

export default {
  name: 'ReminderModal',
  components: { WeatherBox },
  mixins: [validationMixin],
  data() {
    return {
      colorOptions: COLOR_OPTIONS,
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
    ...mapState('calendar', [
      'currentCalendarFirstDateTime',
      'currentCalendarLastDateTime'
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
        ? 'This exact date and time has already been used by a reminder. Please pick another time and/or date'
        : null
    },
    currentDate() {
      return moment(this.dateTime, DATETIME_FORMAT).format(DATE_FORMAT)
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
    addOrEditReminder() {
      this.$v.$touch()
      if (
        this.$v.$invalid ||
        this.timeIsAlreadyUsedError ||
        /* In theory, the following condition could never be set in UI, because the input field has a maxlength=30 validator */
        /* Nonetheless, in order to comply with the unit-test, this condition is checked */
        this.reminderText.length > 30
      ) {
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
    },
    cancel() {
      this.modalActive = false
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
  border-radius: 15px;
}
.reminder-modal-title {
  font-size: 1.5rem;
  text-transform: uppercase;
}
</style>
