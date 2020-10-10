const initialState = {
  active: false,
  reminderText: null,
  datePartAsString: '',
  dateTime: null,
  city: null,
  color: null
}

export const state = () => ({
  ...initialState
})

export const mutations = {
  resetState(state) {
    state = { ...initialState }
  },
  toggleActive(state, newFlag) {
    state.active = newFlag
  },
  setData(state, newObj) {
    state = {
      ...state,
      ...newObj
    }
  },
  setDatePartAsString(state, newString) {
    state.datePartAsString = newString
  }
}
