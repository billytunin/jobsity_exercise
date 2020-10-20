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
        <b-input v-model="reminder.text" type="text" maxlength="30" />
      </b-field>

      <b-field label="Date & Time" class="extra-margin-bottom">
        <b-datetimepicker
          v-model="dateTimeForTimepicker"
          rounded
          placeholder="Click to select..."
          icon="calendar"
          :min-datetime="startOfYear"
          :max-datetime="endOfYear"
        />
      </b-field>

      <b-field label="Color" class="extra-margin-bottom">
        <v-swatches
          v-model="reminder.color"
          :swatches="colorOptions"
        ></v-swatches>
      </b-field>

      <b-field label="City" class="extra-margin-bottom">
        <b-input v-model="reminder.city" placeholder="(Optional)" />
      </b-field>

      <weather-box :city="reminder.city" :date-time="reminder.dateTime" />

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
import { mapState } from 'vuex'

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import WeatherBox from '~/components/weather-box'

import {
  DATETIME_FORMAT,
  COLOR_OPTIONS,
  initialReminderData
} from '~/utils/constants'

export default {
  name: 'ReminderModal',
  components: { WeatherBox },
  mixins: [validationMixin],
  data() {
    return {
      reminder: { ...initialReminderData },
      colorOptions: COLOR_OPTIONS,
      dateTimeForTimepicker: null,
      startOfYear: moment().startOf('year').toDate(),
      endOfYear: moment().endOf('year').toDate()
    }
  },
  computed: {
    ...mapState('reminderModal', [
      'reminderData',
      'active',
      'completeDisplayName',
      'isAddMode',
      'originalDateTime'
    ]),
    modalActive: {
      get() {
        return this.active
      },
      set(newFlag) {
        this.$store.commit('reminderModal/toggleActive', newFlag)
      }
    },
    reminderTextError() {
      return this.$v.reminder.text.$invalid && this.$v.reminder.text.$dirty
        ? 'Reminder text is required'
        : null
    }
  },
  watch: {
    reminderData(newData) {
      this.reminder = { ...newData }
    },
    'reminder.dateTime': {
      handler(newDateTime) {
        this.dateTimeForTimepicker = moment(newDateTime).toDate()
      },
      immediate: true
    },
    dateTimeForTimepicker: {
      handler(newTime) {
        this.reminder.dateTime = moment(newTime).format(DATETIME_FORMAT)
      }
    }
  },
  methods: {
    addOrEditReminder() {
      this.$v.$touch()
      if (
        this.$v.$invalid ||
        /* In theory, the following condition could never be set in UI, because the input field has a maxlength=30 validator */
        /* Nonetheless, in order to comply with the unit-test, this condition is checked */
        this.reminder.text.length > 30
      ) {
        return
      }

      if (this.isAddMode) {
        this.$store.commit('reminders/addReminder', this.reminder)
      } else {
        this.$store.dispatch('reminders/editReminder', {
          reminderObj: this.reminder,
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
    reminder: {
      text: {
        required
      }
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
