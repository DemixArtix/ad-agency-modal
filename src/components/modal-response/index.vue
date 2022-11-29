<template lang="pug">
.modal-response.modal-overlay
  slot
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, computed } from 'vue';

  export default {
    name: "index"
  }
</script>

<style scoped lang="sass">

</style>