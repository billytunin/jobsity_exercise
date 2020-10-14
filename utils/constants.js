import moment from 'moment'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export const TIME_FORMAT = 'HH:mm:ss'
export const DISPLAY_TIME_FORMAT = 'h:mm A'
export const CELSIUS_STRING = 'metric'
export const FAHRENHEIT_STRING = 'imperial'
export const OPENWEATHER_API_KEY = '5e5ee2b035dca84ec0e7b2d83400667b'
export const COLOR_OPTIONS = [
  '#f2c511',
  '#71beff',
  '#69e078',
  '#dd74f7',
  '#ff8a8a',
  '#8c8aff'
]

export const initialReminderData = {
  reminderText: null,
  dateTime: moment().startOf('day').toDate(),
  city: null,
  color: COLOR_OPTIONS[0]
}
