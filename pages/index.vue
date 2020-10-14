<template>
  <section class="section">
    <calendar />
  </section>
</template>

<script>
import Calendar from '~/components/calendar'

export default {
  name: 'HomePage',
  components: { Calendar }
}
</script>

<style>
.section {
  padding-left: 1.3vw;
}
</style>
