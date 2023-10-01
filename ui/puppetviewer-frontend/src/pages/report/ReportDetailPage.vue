<script setup lang="ts">
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import Backend from 'src/client/backend';
import PqlQuery, {PqlEntity} from 'src/puppet/query-builder';
import {Report, Event, ReportLog} from 'src/puppet/models';
import NodeLink from 'components/NodeLink.vue';
import DateField from 'components/DateField.vue';

const route = useRoute();
const report_hash = route.params.report_hash;
const certname = route.params.certname;
const report = ref({} as Report)
const events = ref([] as Event[])

function loadData() {
  const query = new PqlQuery(PqlEntity.Reports);

  query.filter()
    .and().equal('certname', certname)
    .and().equal('hash', report_hash)

  Backend.getQueryResult<Report[]>(query).then(result => {
    if (result.status === 200) {
      report.value = result.data[0];
    }
  })

  const eventQuery = new PqlQuery(PqlEntity.Events);

  eventQuery.filter()
    .and().equal('report', report_hash)
    .and().equal('certname', certname);

  Backend.getQueryResult<Event[]>(eventQuery).then(result => {
    if (result.status === 200) {
      events.value = result.data;
    }
  })
}

function getStatusColorFromLog(log: ReportLog) {
  switch (log.level) {
    case 'err':
      return 'bg-red-2';
    case 'notice':
      return 'bg-amber-3';
    default:
      return '';
  }
}

function getStatusColorFromEvent(event: Event) {
  switch (event.status) {
    case 'failure':
      return 'text-negative';
    default:
      if (event.new_value != event.old_value) {
        return 'text-primary';
      }
  }
}

function getLineFromLog(log: ReportLog) {
  if (!log.file) {
    return ''
  }

  return `${log.file}:${log.line}`
}

onMounted(() => {
  loadData();
})

</script>

<template>
  <q-page padding>
    <q-card>
      <q-card-section class="bg-primary text-white text-h6">
        Summary
      </q-card-section>
      <q-card-section>
        <q-markup-table flat wrap-cells>
          <thead>
          <tr>
            <th class="text-left">Certname</th>
            <th class="text-left">Configuration version</th>
            <th class="text-left">Start time</th>
            <th class="text-left">End time</th>
            <th class="text-left">Duration</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="text-no-wrap">
              <NodeLink :certname="report.certname"/>
            </td>
            <td>{{ report.configuration_version }}</td>
            <td>{{ report.end_time }}</td>
            <td>{{ report.end_time }}</td>
            <td>{{ report.certname }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-card class="q-mt-lg" v-if="report.logs">
      <q-card-section class="bg-primary text-white text-h6">
        Logs
      </q-card-section>
      <q-card-section>
        <q-markup-table flat wrap-cells>
          <thead>
          <tr>
            <th class="text-left">Timestamp</th>
            <th class="text-left">Level</th>
            <th class="text-left">Message</th>
            <th class="text-left">Location</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="log in report.logs.data" :key="log.line" :class="getStatusColorFromLog(log)">
            <td class="text-no-wrap"><DateField :value="log.time"/></td>
            <td>{{ log.level }}</td>
            <td><pre>{{ log.message }}</pre></td>
            <td>{{ getLineFromLog(log) }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-card class="q-mt-lg">
      <q-card-section class="bg-primary text-white text-h6">
        Events
      </q-card-section>
      <q-card-section>
        <q-markup-table flat wrap-cells>
          <thead>
          <tr>
            <th class="text-left">Resource</th>
            <th class="text-left">Status</th>
            <th class="text-left">Changed From</th>
            <th class="text-left">Changed To</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="event in events" :key="event.resource_title" :class="getStatusColorFromEvent(event)">
            <td>{{ event.resource_title }}</td>
            <td>{{ event.status }}</td>
            <td>{{ event.old_value }}</td>
            <td>{{ event.new_value }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-card v-if="report.metrics" class="q-mt-lg">
      <q-card-section class="bg-primary text-white text-h6">
        Metrics
      </q-card-section>
      <q-card-section>
        <q-markup-table flat>
          <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="metric in report.metrics.data" :key="`${metric.category}_${metric.name}`">
            <td>{{ metric.category }}</td>
            <td>{{ metric.name }}</td>
            <td>{{ metric.value }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>

</template>

<style scoped>

</style>
