export const state = () => ({
  dates: {}
})

export const mutations = {
  addReminder(state, { reminderObj, date }) {
    if (state.dates[date]) {
      state.dates[date].reminders.push(reminderObj)
    } else {
      state.dates[date] = {
        reminders: [{ ...reminderObj }]
      }
    }
  }
}
