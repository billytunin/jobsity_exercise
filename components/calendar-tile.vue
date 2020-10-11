<template>
  <div class="calendar-tile columns is-multiline is-marginless">
    <div class="column is-12 is-paddingless">
      <div class="columns is-marginless">
        <div class="column is-half is-paddingless">
          <span>{{ dayObject.monthNumber }}</span>
        </div>
        <div class="column is-half is-paddingless">
          <div class="is-pulled-right">
            <b-icon
              pack="ionicons"
              icon="add-circle"
              @click.native="showAddReminderModal"
            ></b-icon>
            <b-icon
              pack="ionicons"
              icon="remove-circle"
              @click.native="confirmRemoveAllReminders"
            ></b-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarTile',
  props: {
    dayObject: {
      type: Object,
      required: true
    }
  },
  methods: {
    confirmRemoveAllReminders() {
      this.$buefy.dialog.confirm({
        title: 'Privacy Politics',
        message: `Are you sure you want to remove all reminders from ${this.dayObject.formatted}?`,
        confirmText: 'Confirm',
        type: 'is-danger',
        onConfirm: () => this.removeAllReminders()
      })
    },
    removeAllReminders() {
      // Do the thing
    },
    showAddReminderModal() {
      this.$store.commit('reminderModal/showAddReminderModal', {
        date: this.dayObject.dateFormatted,
        completeDisplayName: this.dayObject.completeDisplayName
      })
    }
  }
}
</script>

<style scoped>
.calendar-tile {
  height: 80px;
  border: 1px solid black;
}
</style>
