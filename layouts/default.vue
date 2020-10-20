<template>
  <div class="columns app-container">
    <div class="column is-12">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('calendar/setupMonths')
  }
}
</script>

<style scoped>
.app-container {
  margin-top: 0;
}
</style>
