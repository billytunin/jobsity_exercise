import { shallowMount, createLocalVue } from '@vue/test-utils'

import Vue from 'vue'

import Vuex from 'vuex'
import Buefy from 'buefy'

import ReminderModal from '@/components/reminder-modal'

import { initialReminderData } from '~/utils/constants'

// Ignoring this custom component because we don't need to unit-test it
Vue.config.ignoredElements = ['v-swatches']

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Buefy)

describe('Reminder Modal', () => {
  let store
  const addReminderMock = jest.fn()

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        reminderModal: {
          namespaced: true,
          state: () => ({
            active: true,
            reminderData: {
              ...initialReminderData
            },
            completeDisplayName: 'Saturday, October 10th',
            isAddMode: true,
            originalDateTime: null
          }),
          mutations: {
            // TODO: Move setReminderText to an abstract piece of code that can be consumed both in this
            // unit test and in the real store. This would be helpful to avoid having to update this mutation
            // definition every time the real one from the store changes.
            setReminderText(state, newText) {
              state.reminderData.reminderText = newText
            },
            toggleActive() {}
          }
        },
        calendar: {
          namespaced: true,
          state: () => ({
            currentCalendarFirstDateTime: null,
            currentCalendarLastDateTime: null
          })
        },
        reminders: {
          namespaced: true,
          getters: {
            locateReminderByDateTime: () => () => null
          },
          mutations: {
            addReminder: addReminderMock
          }
        }
      }
    })
  })

  test('if no reminder text is provided, addReminder mutation should not be called', () => {
    const wrapper = shallowMount(ReminderModal, {
      store,
      localVue
    })

    wrapper.vm.addOrEditReminder()
    expect(addReminderMock).not.toHaveBeenCalled()
  })

  test('if reminder text is over 30 characters, addReminder mutation should not be called', () => {
    const wrapper = shallowMount(ReminderModal, {
      store,
      localVue
    })

    store.commit(
      'reminderModal/setReminderText',
      'this a very long reminder over 30 characters long'
    )
    wrapper.vm.addOrEditReminder()
    expect(addReminderMock).not.toHaveBeenCalled()
  })

  test('if all inputs are correct, addReminder mutation should be called', () => {
    const wrapper = shallowMount(ReminderModal, {
      store,
      localVue
    })

    store.commit('reminderModal/setReminderText', 'testing')
    wrapper.vm.addOrEditReminder()
    expect(addReminderMock).toHaveBeenCalled()
  })
})
