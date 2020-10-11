import moment from 'moment'
import { DATE_FORMAT } from '~/utils/constants'

export const state = () => ({
  monthName: '',
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
  ]
})

export const mutations = {
  setDays(state) {
    state.days = getMonthToDisplayRange()
  },
  setMonthName(state) {
    state.monthName = moment().format('MMMM')
  }
}

const getMonthToDisplayRange = () => {
  const arrayToReturn = []
  // This moment object will hold the first Sunday in the month. If the first day of the month isn't a Sunday,
  // it will be the closest previous Sunday to it.
  const startingDay = moment().startOf('month').day(0)
  // This moment object will hold the last Saturday in the month. If the last day of the month isn't a Saturday,
  // it will be the closest next Saturday to it.
  const endingDay = moment().endOf('month').day(6)

  while (startingDay.isSameOrBefore(endingDay, 'day')) {
    arrayToReturn.push({
      monthNumber: startingDay.format('D'),
      weekNumber: startingDay.day(),
      formatted: startingDay.format('MMMM Do'),
      dateFormatted: startingDay.format(DATE_FORMAT),
      completeDisplayName: startingDay.format('dddd, MMMM Do')
    })

    startingDay.add(1, 'day')
  }

  return arrayToReturn
}
