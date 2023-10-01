<script setup lang="ts">
import {Report} from 'src/puppet/models';
import {onMounted, ref} from 'vue';
import Backend from 'src/client/backend';
import PqlQuery, {PqlEntity, PqlSortOrder} from 'src/puppet/query-builder';
import ReportStatus from 'components/ReportStatus.vue';
import DateField from 'components/DateField.vue';

const reports = ref([] as Report[]);

function loadData() {
  const query = new PqlQuery(PqlEntity.Reports);
  query.sortBy().add('end_time', PqlSortOrder.Ascending);
  query.limit(10);

  Backend.getQueryResult<Report[]>(query).then(result => {
    if (result.status === 200) {
      reports.value = result.data;
    }
  })
}

onMounted(() => {
  loadData();
})
</script>

<template>
  <q-page padding>
    <q-markup-table flat bordered>
      <thead>
      <tr>
        <th class="text-left">End time</th>
        <th class="text-left">Status</th>
        <th class="text-left">Certname</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="report in reports" :key="report.hash">
        <td><DateField :value="report.end_time"/></td>
        <td><ReportStatus :report="report"/></td>
        <td>{{ report.certname }}</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<style scoped>

</style>
