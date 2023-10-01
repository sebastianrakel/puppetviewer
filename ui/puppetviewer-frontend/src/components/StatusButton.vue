<script setup lang="ts">

const props = defineProps({
  certname: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  }
})

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'unchanged':
      return 'positive';
    case 'failed':
      return 'negative';
    case 'unreported':
      return 'accent';
    default:
      return 'primary';
  }
}
</script>

<template>
  <q-btn :to="`/report/${certname}/${hash}`" class="q-mr-sm q-mb-xs justify-center" style="min-width: 150px"
             :color="getStatusColor(status)">{{ status }}</q-btn>
</template>

<style scoped>

</style>
