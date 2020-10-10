export const state = () => ({
  days: 'test'
})

export const mutations = {
  setDays(state, newDay) {
    state.days = newDay
  }
}
