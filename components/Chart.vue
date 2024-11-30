<script lang="ts" setup generic="T extends ChartType,U,V">
import { Chart, type ChartConfiguration, type ChartType } from 'chart.js/auto'
const canvas = ref<HTMLCanvasElement>()
const props = defineProps<{config: ChartConfiguration<T & ChartType, U, V>}>()
let chart: Chart<T, U, V>|undefined
watch(canvas, canvas => {
  if (chart) chart.destroy()
  chart = canvas && new Chart(canvas, props.config)
})
watch(() => props.config, ({ data, options }) => {
  if (!chart) return
  chart.data = data
  if (options) chart.options = options
  chart.update()
})
</script>

<template>
  <canvas ref="canvas" :key="config.type" />
</template>
