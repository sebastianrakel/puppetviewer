<script setup lang="ts">
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import {Fact, Node, Report} from 'src/puppet/models';
import Backend from 'src/client/backend';
import PqlQuery, {PqlEntity, PqlSortOrder} from 'src/puppet/query-builder';
import ReportStatus from 'components/ReportStatus.vue';

const route = useRoute();
const node = route.params.node;
const tab = ref('overview');

const node_info = ref(null as Node | null);
const node_facts = ref([] as Fact[])
const reports = ref([] as Report[])

function loadFacts() {
  const query = new PqlQuery(PqlEntity.Facts);
  query.filter().and().equal('certname', node).done().sortBy().add('name', PqlSortOrder.Ascending);

  Backend.getQueryResult<Fact[]>(query).then((result) => {
    if (result.status === 200) {
      node_facts.value = result.data;
    }
  })
}

function loadNodeInfo() {
  const query = new PqlQuery(PqlEntity.Nodes);
  query.filter().and().equal('certname', node).done();

  Backend.getQueryResult<Node[]>(query).then((result) => {
    if (result.status === 200) {
      node_info.value = result.data[0];
    }
  })
}

function loadReports() {
  const query = new PqlQuery(PqlEntity.Reports);
  query.filter().and().equal('certname', node).done()

  Backend.getQueryResult<Report[]>(query).then(result => {
    if (result.status === 200) {
      reports.value = result.data;
    }
  })
}

onMounted(() => {
  loadNodeInfo();
  loadFacts();
  loadReports();
})

</script>

<template>
  <q-page>
    <q-tabs
      v-model="tab"
      class="bg-primary text-white"
      align="justify"
      narrow-indicator
    >
      <q-tab name="overview" label="Overview"/>
      <q-tab name="facts" label="Facts"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="overview">
        <q-card>
          <q-card-section class="bg-primary text-white text-h6">
            Details
          </q-card-section>
          <q-card-section>
            <q-markup-table v-if="node_info" flat>
              <tbody>
              <tr>
                <td class="text-left text-bold">Certname</td>
                <td class="text-left text-bold">{{ node_info.certname }}</td>
              </tr>
              <tr>
                <td class="text-left text-bold">Facts</td>
                <td class="text-left">{{ node_info.facts_timestamp }}</td>
              </tr>
              <tr>
                <td class="text-left text-bold">Catalog</td>
                <td class="text-left">{{ node_info.catalog_timestamp }}</td>
              </tr>
              <tr>
                <td class="text-left text-bold">Report</td>
                <td class="text-left">{{ node_info.report_timestamp }}</td>
              </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
        <q-card class="q-mt-lg">
          <q-card-section class="bg-primary text-white text-h6">
            Reports
          </q-card-section>
          <q-card-section>
            <q-markup-table flat>
              <thead>
              <tr>
                <th>End Time</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="report in reports" :key="report.hash">
                <td>{{ report.end_time }}</td>
                <td><ReportStatus :report="report"/></td>
              </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="facts">
        <q-markup-table class="q-mt-lg" wrap-cells flat>
          <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Value</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="fact in node_facts" :key="fact.name">
            <td class="text-left">{{ fact.name }}</td>
            <td class="text-left">
              <pre>{{ fact.value }}</pre>
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style scoped>

</style>
