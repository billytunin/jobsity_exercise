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
        label="Date & Time"
        :type="timeIsAlreadyUsedError ? 'is-danger' : null"
        :message="timeIsAlreadyUsedError"
      >
        <b-datetimepicker
          v-model="dateTimeForTimepicker"
          rounded
          placeholder="Click to select..."
          icon="calendar"
        />
      </b-field>

      <b-field label="Color">
        <v-swatches v-model="color"></v-swatches>
      </b-field>

      <b-field label="City">
        <b-input v-model="city" placeholder="(Optional)" />
      </b-field>

      <b-field label="Weather">
        <div class="weather-info-container">
          <b-loading
            v-model="weather.loading"
            :is-full-page="false"
          ></b-loading>
          <div v-if="weather.loading === false">
            <span v-if="!weather.forecast">
              No data available for this date and/or city
            </span>
            <weather-box v-else :weather-forecast="weather.forecast" />
          </div>
        </div>
      </b-field>

      <b-button type="is-success" @click="addOrEditReminder">{{
        isAddMode ? 'Add' : 'Edit'
      }}</b-button>
      <b-button @click="cancel">Cancel</b-button>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { debounce } from 'lodash'
import { mapState, mapGetters, mapActions } from 'vuex'

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import WeatherBox from '~/components/weather-box'

import { DATETIME_FORMAT, DATE_FORMAT } from '~/utils/constants'

export default {
  name: 'ReminderModal',
  components: { WeatherBox },
  mixins: [validationMixin],
  data() {
    return {
      dateTimeForTimepicker: null,
      weather: {
        loading: false,
        forecast: null
      }
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
        ? 'This exact date and time has already been used by a reminder. Please pick another time and/or date'
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
    },
    city: debounce(function () {
      if (!this.weather.loading) {
        this.loadWeather()
      }
    }, 300),
    modalActive: {
      handler(newFlag) {
        if (newFlag) {
          this.loadWeather()
        }
      }
    }
  },
  methods: {
    ...mapActions('weather', ['loadWeatherForCityByDate']),
    addOrEditReminder() {
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
    },
    cancel() {
      this.modalActive = false
    },
    async loadWeather() {
      this.weather.loading = true
      this.weather.forecast = await this.loadWeatherForCityByDate({
        city: this.city,
        date: moment(this.dateTime, DATETIME_FORMAT).format(DATE_FORMAT)
      })
      this.weather.loading = false
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
.weather-info-container {
  position: relative;
  min-height: 60px;
}
</style>
