<script setup lang="ts">

import {PropType} from 'vue/dist/vue';
import {Report} from 'src/puppet/models';
import StatusButton from 'components/StatusButton.vue';

const props = defineProps({
  report: {
    type: Object as PropType<Report>,
    required: true,
  },
})

function getMetricValue(category: string, name: string): number {
  return props.report.metrics.data.filter(s => s.category == category && s.name == name)[0].value;
}

</script>

<template>
  <div class="row">
    <StatusButton :status="report.status" :hash="report.hash" :certname="report.certname"/>
    <q-btn disable color='blue-grey' class="q-mb-xs" style="min-width: 64px;">{{ getMetricValue('resources', 'total') }}</q-btn>
    <q-btn class="q-ml-xs q-mb-xs" disable color='grey' style="min-width: 64px;">0</q-btn>
    <q-btn class="q-ml-xs q-mb-xs" disable color='grey' style="min-width: 64px;">0</q-btn>
    <q-btn class="q-ml-xs q-mb-xs" disable color='grey' style="min-width: 64px;">0</q-btn>
    <q-btn class="q-ml-xs q-mb-xs" disable color='grey' style="min-width: 64px;">0</q-btn>
  </div>
</template>

<style scoped>

</style>
