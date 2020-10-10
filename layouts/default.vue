<template>
  <div class="columns">
    <div class="column is-12">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('calendar/setMonthName')
    this.$store.commit('calendar/setDays')
  }
}
</script>
