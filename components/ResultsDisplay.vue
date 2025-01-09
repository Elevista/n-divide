<script lang="ts" setup>
import type { ChartConfiguration } from 'chart.js'
import tinycolor from 'tinycolor2'
import { colors } from 'quasar'
const store = useStore(), q = useQuasar()

const props = defineProps<{
  share?: boolean;
  accountInfo?: string,
  items: SimpleData['items'],
  people: SimpleData['people']
}>()

const color = (i: number) => tinycolor(colors.getPaletteColor(getColor(i))).saturate(6).brighten(15).toString()

const bars = computed(() => props.people.length && ({
  type: 'bar',
  options: {
    aspectRatio: 3 / 2,
    scales: { x: { stacked: true }, y: { stacked: true } },
  },
  data: {
    labels: props.people.map(x => x.name),
    datasets: props.items.map((item, i) => ({
      label: item.name,
      data: props.people.map(x => x.items[i].sum),
      backgroundColor: color(i),
      borderWidth: 1,
    })),
  },
} satisfies ChartConfiguration))

const pie = computed(() => props.items.length && ({
  type: 'doughnut',
  options: { aspectRatio: 3 / 2 },
  data: {
    labels: props.items.map(x => x.name),
    datasets: [{
      data: props.items.map(item => item.sum),
      backgroundColor: props.items.map((_, i) => color(i)),
    }],
  },
} satisfies ChartConfiguration))

const copyShareUrl = () => {
  navigator.clipboard.writeText(getShareUrl(props))
  q.notify('URL이 클립보드로 복사 되었습니다.')
}

const back = () => {
  if (history.state?.showResult) history.back()
  else store.showResult = false
}

const sum = computed(() => props.people.reduce((acc, cur) => acc + cur.items.reduce((acc, cur) => acc + cur.sum, 0), 0))
const diff = computed(() => sum.value - props.items.reduce((acc, cur) => acc + cur.sum, 0))
</script>

<template>
  <QCard class="h-[fit-content] min-h-[100vh] fd-c">
    <QCardSection class="fd-r ai-c">
      <div class="text-h6 mr-a">정산 결과</div>
      <QBtn v-if="people.length&&items.length" icon="share" round flat
            size="sm" @click="copyShareUrl" />
      <slot v-if="share" name="buttons" />
    </QCardSection>
    <QList>
      <Result v-for="(person, i) of people" :key="i" :name="person.name" :items="person.items"
              :expand-separator="i + 1 < people.length" :account-info="accountInfo" :share="share" />
      <QItem v-if="bars" class="aspect-[3/2]"><Chart v-if="bars" :config="bars" /></QItem>
      <QItem v-if="pie" class="aspect-[3/2]"><Chart v-if="pie" :config="pie" /></QItem>
      <QSeparator />
      <QItem class="selectable">
        <QItemSection><QItemLabel>총액</QItemLabel></QItemSection>
        <QItemSection side><QItemLabel>{{ numberFormat(sum) }}원</QItemLabel></QItemSection>
      </QItem>
      <QItem v-if="share" class="selectable">
        <QItemSection><QItemLabel>차액</QItemLabel></QItemSection>
        <QItemSection side><QItemLabel>{{ intFormat(diff) }}원</QItemLabel></QItemSection>
      </QItem>
      <QItem v-if="share && people.length && sum > 0" class="fd-c ai-c">
        <a href="https://link.kakaopay.com/_/rCXu4ox" target="_blank" class="flex">
          <img src="../assets/btn_request_small.png">
        </a>
      </QItem>
    </QList>
    <QCardActions align="right" class="mt-a">
      <QBtn flat label="확인" color="primary" @click="back" />
    </QCardActions>
    <slot />
  </QCard>
</template>
