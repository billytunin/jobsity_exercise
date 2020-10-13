import { shallowMount, createLocalVue } from '@vue/test-utils'

import Vue from 'vue'

import Vuex from 'vuex'
import Buefy from 'buefy'

import ReminderModal from '@/components/reminder-modal'

import {
  state as reminderModalState,
  mutations as reminderModalMutations
} from '~/store/reminderModal'
import { state as calendarState } from '~/store/calendar'
import {
  state as remindersState,
  mutations as remindersMutations,
  getters as remindersGetters
} from '~/store/reminders'

// Ignoring this custom component because we don't need to unit-test it
Vue.config.ignoredElements = ['v-swatches']

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Buefy)

describe('Reminder Modal', () => {
  let store
  const reminderText = 'testing'
  const city = 'Buenos Aires'
  const color = 'red'
  const date = '2020-10-13'
  const dateTime = '2020-10-13T21:00:00'

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        reminderModal: {
          namespaced: true,
          state: reminderModalState,
          mutations: reminderModalMutations
        },
        calendar: {
          namespaced: true,
          state: calendarState
        },
        reminders: {
          namespaced: true,
          state: remindersState,
          getters: remindersGetters,
          mutations: remindersMutations
        }
      }
    })

    // Setup, on the modal, the data that should be used to create the reminder
    store.commit('reminderModal/showAddReminderModal', { date })
    store.commit('reminderModal/setReminderText', reminderText)
    store.commit('reminderModal/setReminderCity', city)
    store.commit('reminderModal/setReminderColor', color)
    store.commit('reminderModal/setReminderDateTime', dateTime)
  })

  test('if no reminder text is provided, reminder shouldnt be added', () => {
    const wrapper = shallowMount(ReminderModal, {
      store,
      localVue
    })

    store.commit('reminderModal/setReminderText', null)
    wrapper.vm.addOrEditReminder()
    expect(store.state.reminders.dates.length).toEqual(0)
  })

  test('if reminder text is over 30 characters, reminder shouldnt be added', () => {
    const wrapper = shallowMount(ReminderModal, {
      store,
      localVue
    })

    store.commit(
      'reminderModal/setReminderText',
      'this a very long reminder over 30 characters long'
    )
    wrapper.vm.addOrEditReminder()
    expect(store.state.reminders.dates.length).toEqual(0)
  })

  test('if all inputs are correct, reminder should be added', () => {
    const wrapper = shallowMount(ReminderModal, {
      store,
      localVue
    })

    wrapper.vm.addOrEditReminder()

    expect(store.state.reminders.dates[0].date).toEqual(date)
    expect(store.state.reminders.dates[0].reminders[0].reminderText).toEqual(
      reminderText
    )
    expect(store.state.reminders.dates[0].reminders[0].city).toEqual(city)
    expect(store.state.reminders.dates[0].reminders[0].color).toEqual(color)
    expect(store.state.reminders.dates[0].reminders[0].dateTime).toEqual(
      dateTime
    )
  })
})
