<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Puppetviewer
        </q-toolbar-title>

        <q-toggle v-model="darkMode" color="secondary" checked-icon="light_mode" unchecked-icon="dark_mode" @update:modelValue="updateDarkMode"/>
        <div>v0.1.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <q-item clickable :to="{name: 'FactsOverview'}">
          <q-item-section avatar>
            <q-icon name="list"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>Facts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{name: 'NodesOverview'}">
          <q-item-section avatar>
            <q-icon name="computer"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>Nodes</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{name: 'ReportsOverview'}">
          <q-item-section avatar>
            <q-icon name="report"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>Reports</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{name: 'Query'}">
          <q-item-section avatar>
            <q-icon name="terminal"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>Query</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

export default defineComponent({
  name: 'MainLayout',
  methods: {
    updateDarkMode() {
      this.$q.dark.set(this.darkMode);
    }
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const darkMode = ref(false);

    return {
      leftDrawerOpen,
      darkMode,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
});
</script>
