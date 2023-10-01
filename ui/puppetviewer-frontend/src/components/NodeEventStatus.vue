<script setup lang="ts">
import {PropType} from 'vue';
import {EventCount, Node} from 'src/puppet/models';
import StatusButton from 'components/StatusButton.vue';

const props = defineProps({
  node: {
    type: Object as PropType<Node>,
    required: true,
  },
  event_count: {
    type: Object as PropType<EventCount>
  }
})

</script>

<template>
  <div class="row">
    <StatusButton :status="node.latest_report_status" :hash="node.latest_report_hash" :certname="node.certname"/>
    <div v-if="event_count">
      <q-btn disable class="q-mb-xs" color='negative' style="min-width: 64px;">
        {{ event_count.failures }}
      </q-btn>
      <q-btn class="q-ml-xs q-mb-xs" disable color='primary' style="min-width: 64px;">
        {{ event_count.successes }}
      </q-btn>
      <q-btn class="q-ml-xs q-mb-xs" disable color='warning' style="min-width: 64px;">
        {{ event_count.skips }}
      </q-btn>
      <q-btn class="q-ml-xs q-mb-xs" disable color='grey' style="min-width: 64px;">
        {{ event_count.noops }}
      </q-btn>
    </div>
    <div v-else>
      <q-btn disable class="q-mb-xs" color='grey' style="min-width: 64px;">0</q-btn>
      <q-btn class="q-ml-xs q-mb-xs" disable color='grey' style="min-width: 64px;">0</q-btn>
      <q-btn class="q-ml-xs q-mb-xs" disable color='grey' style="min-width: 64px;">0</q-btn>
      <q-btn class="q-ml-xs q-mb-xs" disable color='grey' style="min-width: 64px;">0</q-btn>
    </div>
  </div>
</template>

<style scoped>

</style>
