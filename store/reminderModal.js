import moment from 'moment'

const initialReminderData = {
  reminderText: null,
  time: moment().startOf('day').toDate(),
  city: null,
  color: 'red'
}

const initialState = {
  isAddMode: true,
  active: false,
  datePartAsString: '',
  completeDisplayName: null,
  reminderData: { ...initialReminderData }
}

export const state = () => ({
  ...initialState
})

export const mutations = {
  showAddReminderModal(state, { date, completeDisplayName }) {
    state.reminderData = { ...initialReminderData }
    state.active = true
    state.isAddMode = true
    state.datePartAsString = date
    state.completeDisplayName = completeDisplayName
  },
  setReminderText(state, newText) {
    state.reminderData.reminderText = newText
  },
  setReminderTime(state, newTime) {
    state.reminderData.time = newTime
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
