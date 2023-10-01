<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import Backend from 'src/client/backend';
import {Node} from 'src/puppet/models';
import PqlQuery, {PqlEntity, PqlSortOrder} from 'src/puppet/query-builder';
import NodeLink from 'components/NodeLink.vue';
import ReportStatus from 'components/NodeEventStatus.vue';
import DateField from 'components/DateField.vue';
import {useQuasar} from 'quasar';

const nodes = ref([] as Node[]);
const event_counts = ref({});
const filter = ref('');
const q = useQuasar();

function loadData() {
  const query = new PqlQuery(PqlEntity.Nodes);

  query.filter().and().equal('facts_environment', 'production');
  query.sortBy().add('catalog_timestamp', PqlSortOrder.Descending);

  q.loading.show();

  Backend.getQueryResult<Node[]>(query).then((result) => {
    if (result.status === 200) {
      nodes.value = result.data;
    }
  }).finally(() => {
    q.loading.hide();
  })

  Backend.getEventCounts().then((result) => {
    if (result.status === 200) {
      event_counts.value = Object.fromEntries(
        result.data.map(e => [e.subject.title, e])
      );
    }
  })
}

const filteredNodes = computed(() => {
  return nodes.value.filter(s => s.certname.includes(filter.value))
});

onMounted(() => {
  loadData();
})
</script>

<template>
  <q-page padding>
    <q-input v-model="filter" label="Search"/>
    <q-markup-table class="q-mt-lg" flat bordered>
      <thead>
      <tr>
        <th class="text-left">Status</th>
        <th class="text-left">Certname</th>
        <th class="text-left">Catalog</th>
        <th class="text-left">Report</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="node in filteredNodes" :key="node.certname">
        <td class="text-left">
         <ReportStatus :node="node" :event_count="event_counts[node.certname]"/>
        </td>
        <td class="text-left"><NodeLink :certname="node.certname" /></td>
        <td class="text-left"><DateField :value="node.catalog_timestamp"/></td>
        <td class="text-left"><DateField :value="node.report_timestamp"/></td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<style scoped>

</style>
