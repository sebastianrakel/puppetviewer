<script setup lang="ts">
import {PropType} from 'vue';
import {date} from 'quasar';


const props = defineProps({
  value: {
    type: Object as PropType<Date>,
    required: true,
  }
})
</script>

<template>
<div class="text-subtitle1">{{date.formatDate(value, 'DD. MMM. YYYY - HH:mm:ss') }}</div>
</template>

<style scoped>

</style>
