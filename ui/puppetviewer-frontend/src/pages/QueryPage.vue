<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import Backend from 'src/client/backend';
import {SavedQuery} from 'src/client/models';

const query = ref('');
const data = ref([] as unknown[])
const savedQueries = ref([] as SavedQuery[]);
const selectedQuery = ref(null as SavedQuery|null);

function executeQuery() {
  Backend.getQueryResult<unknown[]>(query.value).then((result) => {
    if (result.status === 200) {
      data.value = result.data;
    }
  })
}

function loadSavedQueries() {
  Backend.getSavedQueries().then((result) => {
    if (result.status === 200) {
      savedQueries.value = result.data;
    }
  })
}

function fillSelectedQuery() {
  console.log('load')
  if (selectedQuery.value === null) {
    return;
  }

  query.value = selectedQuery.value.query;
}

const hasData = computed(() => {
  return data.value.length > 0;
})

const columns = computed(() => {
  const firstItem = data.value.at(0);
  if (firstItem === null) {
    return [];
  }

  return Object.keys(firstItem);
})

const values = computed(() => {
  const result = [] as unknown[];
  data.value.forEach((entry: unknown) => {
    result.push(Object.values(entry))
  })

  return result;
})

onMounted(() => {
  loadSavedQueries();
})

</script>

<template>
  <q-page padding>
    <q-input v-model="query" type="textarea" label="Query" placeholder="nodes {}"/>
    <q-select v-model="selectedQuery" :options="savedQueries"
              label="Saved Queries" emit-value map-options option-label="name" @update:modelValue="fillSelectedQuery"/>
    <q-btn label="Execute" class="q-mt-lg" color="primary" @click="executeQuery"/>

    <q-markup-table class="q-mt-lg" v-if="hasData">
      <thead>
      <tr>
        <th class="text-left" v-for="column in columns" :key="column">{{ column }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in values" :key="row">
        <td class="text-left" v-for="col in row" :key="col">{{ col }}</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<style scoped>

</style>
