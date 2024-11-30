<script lang="ts" setup>
import type { ChartConfiguration } from 'chart.js'
import tinycolor from 'tinycolor2'
import { colors } from 'quasar'
const store = useStore(), q = useQuasar()

const sum = computed(() => store.items.reduce((acc, cur) => {
  acc.all += cur.price * cur.count
  const count = cur.n.filter(x => x.who).length
  if (count) acc.n += (cur.price * cur.count) * (count / cur.n.length)
  return acc
}, { all: 0, n: 0 }))

const copy = () => {
  navigator.clipboard.writeText(list.value.flatMap(x => [
    `${x.name} ${x.sum}원`,
    ...x.items.map((item, i) => ` ${i + 1 < x.items.length ? '├' : '└'}─ ${item.name} ${intFormat(item.sum)}원`),
  ]).join('\n'))
  q.notify('클립보드로 복사 되었습니다.')
}

const list = computed(() => store.people.map(person => ({
  ...person,
  sum: intFormat(person.n.reduce((acc, cur) => acc + (cur.item.price * cur.item.count) / cur.item.n.length, 0)),
  items: store.items.flatMap(item => {
    const { n, price } = item
    const count = n.filter(x => x.who?.id === person.id).length
    if (!count) return []
    const sum = ((price * item.count) * (count / n.length))
    return { ...item, sum }
  }),
})))

const back = () => {
  if (history.state?.showResult) history.back()
  else store.showResult = false
}

const color = (i: number) => tinycolor(colors.getPaletteColor(getColor(i))).saturate(6).brighten(15).toString()

const bars = computed(() => list.value.length && ({
  type: 'bar',
  options: {
    aspectRatio: 3 / 2,
    scales: { x: { stacked: true }, y: { stacked: true } },
  },
  data: {
    labels: list.value.map(x => x.name),
    datasets: store.items.map((item, i) => ({
      label: item.name,
      data: list.value.map(person => person.items.find(x => x.id === item.id)?.sum ?? 0),
      backgroundColor: color(i),
      borderWidth: 1,
    })),
  },
} satisfies ChartConfiguration))

const pie = computed(() => store.items.length && ({
  type: 'doughnut',
  options: { aspectRatio: 3 / 2 },
  data: {
    labels: store.items.map(x => x.name),
    datasets: [{
      data: store.items.map(item => item.count * item.price),
      backgroundColor: store.items.map((_, i) => color(i)),
    }],
  },
} satisfies ChartConfiguration))

</script>

<template>
  <QCard class="h-[fit-content] min-h-[100vh] fd-c">
    <QCardSection class="fd-r ai-c">
      <div class="text-h6 mr-a">정산 결과</div>
      <QBtn icon="content_copy" round flat size="sm"
            @click="copy" />
    </QCardSection>
    <QList>
      <Result v-for="(person,i) of store.people" :key="person.id" :person="person" :expand-separator="i+1<store.people.length" />
      <QItem v-if="bars" class="aspect-[3/2]"><Chart v-if="bars" :config="bars" /></QItem>
      <QItem v-if="pie" class="aspect-[3/2]"><Chart v-if="pie" :config="pie" /></QItem>
      <QSeparator />
      <QItem class="selectable">
        <QItemSection><QItemLabel>총액</QItemLabel></QItemSection>
        <QItemSection side><QItemLabel>{{ numberFormat(sum.all) }}원</QItemLabel></QItemSection>
      </QItem>
      <QItem class="selectable">
        <QItemSection><QItemLabel>차액</QItemLabel></QItemSection>
        <QItemSection side><QItemLabel>{{ intFormat(sum.n - sum.all) }}원</QItemLabel></QItemSection>
      </QItem>
    </QList>
    <QCardActions align="right" class="mt-a">
      <QBtn flat label="확인" color="primary" @click="back" />
    </QCardActions>
  </QCard>
</template>
