<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import Backend from 'src/client/backend';
import PqlQuery, {PqlEntity} from 'src/puppet/query-builder';

const facts = ref([] as string[]);
const filter = ref('');

interface IFactHash {
  [details: string]: string[]
}

function loadFacts() {
  Backend.getFactNames().then(result => {
    if (result.status === 200) {
      facts.value = result.data;
    }
  })
}


const filteredFacts = computed(() => {
  let result = {} as IFactHash;

  facts.value.filter(s => s.includes(filter.value)).forEach((fact) => {
    const letter = fact.charAt(0).toUpperCase();

    if (result[letter] === undefined) {
      result[letter] = [];
    }

    result[letter].push(fact)
  });

  return result;
})

onMounted(() => {
  loadFacts();
})

</script>

<template>
  <q-page padding>
    <q-input v-model="filter" label="Search"/>
    <div class="column" style="max-height: 100%">
      <q-card class="q-ma-md" v-for="(groupedFacts, letter) in filteredFacts" :key="letter">
        <q-card-section class="bg-primary text-white text-h6">
          {{ letter }}
        </q-card-section>
        <q-card-section>
          <ul>
            <li v-for="fact in groupedFacts" :key="fact">
              <a :href="`/#/fact/${fact}`">{{ fact }}</a>
            </li>
          </ul>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>

</style>
