<script lang="ts" setup>
const store = useStore()
let data = parseShareUrl(useRoute().fullPath)
if (data) history.replaceState(null, '', window.location.origin + window.location.pathname)
const unwatch = watch(() => store.showResult, () => { data = undefined; unwatch() })
</script>

<template>
  <ResultsDisplay v-if="data" :items="data.items" :people="data.people" />
  <ResultsReal v-else />
</template>
