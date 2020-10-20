import moment from 'moment'
import { DATE_FORMAT, MONTH_DISPLAY_FORMAT } from '~/utils/constants'

export const state = () => ({
  monthDate: null,
  monthName: null,
  days: [],
  weekDaysMap: [
    {
      name: 'Sunday',
      number: 0
    },
    {
      name: 'Monday',
      number: 1
    },
    {
      name: 'Tuesday',
      number: 2
    },
    {
      name: 'Wednesday',
      number: 3
    },
    {
      name: 'Thursday',
      number: 4
    },
    {
      name: 'Friday',
      number: 5
    },
    {
      name: 'Saturday',
      number: 6
    }
  ],
  months: {}
})

export const actions = {
  setupMonths({ commit }) {
    const months = {}
    const startingMonth = moment().startOf('year')
    const endingMonth = moment().endOf('year')

    while (startingMonth.isSameOrBefore(endingMonth, 'month')) {
      months[startingMonth.format(MONTH_DISPLAY_FORMAT)] = startingMonth.format(
        DATE_FORMAT
      )
      startingMonth.add(1, 'month')
    }

    commit('setMonths', months)
    commit('setMonth', moment().format(MONTH_DISPLAY_FORMAT))
  }
}

export const mutations = {
  setMonth(state, monthName) {
    const date = state.months[monthName] || moment().format(DATE_FORMAT)
    const arrayToReturn = []
    // This moment object will hold the first Sunday in the month. If the first day of the month isn't a Sunday,
    // it will be the closest previous Sunday to it.
    const startingDay = moment(date, DATE_FORMAT).startOf('month').day(0)
    // This moment object will hold the last Saturday in the month. If the last day of the month isn't a Saturday,
    // it will be the closest next Saturday to it.
    const endingDay = moment(date, DATE_FORMAT).endOf('month').day(6)

    while (startingDay.isSameOrBefore(endingDay, 'day')) {
      arrayToReturn.push({
        monthNumber: startingDay.format('D'),
        weekDayNumber: startingDay.day(),
        formatted: startingDay.format('MMMM Do'),
        dateFormatted: startingDay.format(DATE_FORMAT),
        completeDisplayName: startingDay.format('dddd, MMMM Do')
      })

      startingDay.add(1, 'day')
    }

    state.days = arrayToReturn
    state.monthDate = date
    state.monthName = monthName
  },
  setMonths(state, months) {
    state.months = months
  }
}
