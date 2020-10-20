import moment from 'moment'
import { DATE_FORMAT, initialReminderData } from '~/utils/constants'

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
  toggleActive(state, newFlag) {
    state.active = newFlag
  }
}
