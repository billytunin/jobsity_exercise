import moment from 'moment'
import { DATE_FORMAT } from '~/utils/constants'

const initialReminderData = {
  reminderText: null,
  dateTime: moment().startOf('day').toDate(),
  city: null,
  color: '#F2C511'
}

const initialState = {
  isAddMode: true,
  active: false,
  completeDisplayName: null,
  originalDateTime: null,
  reminderData: { ...initialReminderData }
}

export const state = () => ({
  ...initialState
})

export const mutations = {
  showAddReminderModal(state, { date, completeDisplayName }) {
    state.reminderData = {
      ...initialReminderData,
      dateTime: moment(date, DATE_FORMAT).startOf('day').toDate()
    }
    state.originalDateTime = null
    state.active = true
    state.isAddMode = true
    state.completeDisplayName = completeDisplayName
  },
  showEditReminderModal(state, { reminderObj, completeDisplayName }) {
    state.reminderData = {
      ...initialReminderData,
      ...reminderObj
    }
    state.originalDateTime = reminderObj.dateTime
    state.active = true
    state.isAddMode = false
    state.completeDisplayName = completeDisplayName
  },
  setReminderText(state, newText) {
    state.reminderData.reminderText = newText
  },
  setReminderDateTime(state, newDateTime) {
    state.reminderData.dateTime = newDateTime
  },
  setReminderCity(state, newCity) {
    state.reminderData.city = newCity
  },
  setReminderColor(state, newColor) {
    state.reminderData.color = newColor
  },
  toggleActive(state, newFlag) {
    state.active = newFlag
  }
}
