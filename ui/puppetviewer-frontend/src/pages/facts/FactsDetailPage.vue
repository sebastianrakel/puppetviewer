<script setup lang="ts">
import {useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';
import Backend from 'src/client/backend';
import {Fact} from 'src/puppet/models';

const route = useRoute();
const fact = route.params.fact;
const facts = ref([] as Fact[])

function loadFacts() {
  Backend.getQueryResult<Fact[]>(`facts { name = '${fact}'}`).then((result) => {
    if (result.status === 200) {
      facts.value = result.data;
    }
  })
}

onMounted(() => {
  loadFacts();
})

</script>

<template>
  <q-page padding>
    <div class="text-h2">{{ fact }}</div>
    <q-markup-table class="q-mt-lg">
      <thead class="bg-primary text-white">
      <tr>
        <th class="text-left">Node</th>
        <th class="text-right">Value</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="fact in facts" :key="fact.certname + '_' + fact.name">
        <td class="text-left"><a :href="`/#/node/${fact.certname}`">{{ fact.certname }}</a></td>
        <td class="text-right">{{ fact.value }}</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<style scoped>

</style>
