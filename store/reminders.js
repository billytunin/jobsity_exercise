import { cloneDeep } from 'lodash'
import moment from 'moment'
import { DATE_FORMAT, DATETIME_FORMAT } from '~/utils/constants'

export const state = () => ({
  dates: []
})

export const actions = {
  editReminder(
    { getters, commit, dispatch },
    { reminderObj, originalDateTime }
  ) {
    const locatedReminder = getters.locateReminderByDateTime(originalDateTime)
    if (!locatedReminder) {
      throw new Error('No reminder found for specified date and time')
    }

    const isDayChange = !moment(originalDateTime).isSame(
      reminderObj.dateTime,
      'day'
    )
    if (isDayChange) {
      dispatch('removeReminder', { locatedReminder })
      commit('addReminder', reminderObj)
    } else {
      commit('commitEditReminder', { reminderObj, locatedReminder })
    }
  },
  removeReminder({ getters, commit }, { dateTime, locatedReminder }) {
    if (!locatedReminder) {
      locatedReminder = getters.locateReminderByDateTime(dateTime)
    }
    if (!locatedReminder) {
      throw new Error('No reminder found for specified date and time')
    }

    commit('commitRemoveReminder', locatedReminder)
  }
}

export const mutations = {
  addReminder(state, reminderObj) {
    const date = moment(reminderObj.dateTime, DATETIME_FORMAT).format(
      DATE_FORMAT
    )
    const foundDateIndex = state.dates.findIndex(
      dateObj => dateObj.date === date
    )
    if (foundDateIndex !== -1) {
      state.dates[foundDateIndex].reminders.push(reminderObj)
    } else {
      state.dates.push({
        date,
        reminders: [{ ...reminderObj }]
      })
    }
  },
  commitEditReminder(state, { reminderObj, locatedReminder }) {
    const currentDatesArray = cloneDeep(state.dates)
    currentDatesArray[locatedReminder.dateIndex].reminders[
      locatedReminder.reminderIndex
    ] = { ...reminderObj }
    state.dates = currentDatesArray
  },
  commitRemoveReminder(state, locatedReminder) {
    const currentDatesArray = cloneDeep(state.dates)
    currentDatesArray[locatedReminder.dateIndex].reminders.splice(
      locatedReminder.reminderIndex,
      1
    )
    if (!currentDatesArray[locatedReminder.dateIndex].reminders.length) {
      currentDatesArray.splice(locatedReminder.dateIndex, 1)
    }
    state.dates = currentDatesArray
  },
  removeAllReminders(state, date) {
    const foundDateIndex = state.dates.findIndex(
      dateObj => dateObj.date === date
    )
    if (foundDateIndex === -1) {
      throw new Error('No reminders found for specified date')
    }

    state.dates.splice(foundDateIndex, 1)
  }
}

export const getters = {
  getRemindersByDate: state => date => {
    const foundDateIndex = state.dates.findIndex(
      dateObj => dateObj.date === date
    )
    if (foundDateIndex !== -1) {
      return state.dates[foundDateIndex].reminders
    } else {
      return []
    }
  },
  locateReminderByDateTime: state => dateTime => {
    const dateString = moment(dateTime, DATETIME_FORMAT).format(DATE_FORMAT)
    const foundDateIndex = state.dates.findIndex(
      dateObj => dateObj.date === dateString
    )

    if (foundDateIndex !== -1) {
      const foundReminderIndex = state.dates[
        foundDateIndex
      ].reminders.findIndex(reminderObj => reminderObj.dateTime === dateTime)
      return foundReminderIndex !== -1
        ? { dateIndex: foundDateIndex, reminderIndex: foundReminderIndex }
        : null
    } else {
      return null
    }
  }
}
