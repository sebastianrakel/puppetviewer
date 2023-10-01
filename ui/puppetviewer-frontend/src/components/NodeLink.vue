<script setup lang="ts">
const props = defineProps([
  'certname'
  ]);
</script>

<template>
  <router-link class="text-subtitle1" :to="`/node/${props.certname}`">{{ props.certname }}</router-link>
</template>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
