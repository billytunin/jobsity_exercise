import { cloneDeep } from 'lodash'
import moment from 'moment'
import { DATE_FORMAT, DATETIME_FORMAT } from '~/utils/constants'

export const state = () => ({
  dates: [],
  lastId: 0
})

export const actions = {
  editReminder(
    { getters, commit, dispatch },
    { reminderObj, originalDateTime }
  ) {
    const locatedReminder = getters.locateReminderById({
      dateTime: originalDateTime,
      id: reminderObj.id
    })
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
  removeReminder({ getters, commit }, { dateTime, id, locatedReminder }) {
    if (!locatedReminder) {
      locatedReminder = getters.locateReminderById({ dateTime, id })
    }
    if (!locatedReminder) {
      throw new Error('No reminder found for specified date and time')
    }

    commit('commitRemoveReminder', locatedReminder)
  }
}

export const mutations = {
  addReminder(state, reminderObj) {
    reminderObj.id = state.lastId
    state.lastId++

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
  /*
   * Locate reminder by ID. Uses dateTime property of the reminder for efficiency (dateTime allows to know in which date array the reminder is)
   * and, thus, we save the time consumed by that search.
   */
  locateReminderById: state => ({ dateTime, id }) => {
    const dateString = moment(dateTime, DATETIME_FORMAT).format(DATE_FORMAT)
    const foundDateIndex = state.dates.findIndex(
      dateObj => dateObj.date === dateString
    )

    if (foundDateIndex !== -1) {
      const foundReminderIndex = state.dates[
        foundDateIndex
      ].reminders.findIndex(reminderObj => reminderObj.id === id)
      return foundReminderIndex !== -1
        ? { dateIndex: foundDateIndex, reminderIndex: foundReminderIndex }
        : null
    } else {
      return null
    }
  }
}
