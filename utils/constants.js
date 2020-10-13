import moment from 'moment'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export const TIME_FORMAT = 'HH:mm:ss'
export const DISPLAY_TIME_FORMAT = 'h:mm A'
export const CELSIUS_STRING = 'metric'
export const FAHRENHEIT_STRING = 'imperial'
export const OPENWEATHER_API_KEY = '5e5ee2b035dca84ec0e7b2d83400667b'

export const initialReminderData = {
  reminderText: null,
  dateTime: moment().startOf('day').toDate(),
  city: null,
  color: '#F2C511'
}
