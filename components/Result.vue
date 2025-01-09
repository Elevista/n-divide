<script lang="ts" setup>
const props = defineProps<{
  share?: boolean,
  name: string,
  accountInfo?: string,
  items: SimpleData['items'],
  expandSeparator?: boolean
}>()
const items = computed(() => props.items.filter(x => x.sum))
const sum = computed(() => intFormat(items.value.reduce((acc, cur) => acc + cur.sum, 0)))
const displayItems = computed(() => items.value.map(x => ({ ...x, sum: intFormat(x.sum) })))
const shareItems = computed(() => {
  if (items.value.length <= 5) return displayItems.value
  const rest = items.value.slice(4)
  const sum = intFormat(rest.reduce((acc, cur) => acc + cur.sum, 0))
  return [...displayItems.value.slice(0, 4), { name: rest.map(x => x.name).join(','), sum }]
})
// const nim = computed(() => /님(?=[^\p{L}\w])/u.test(name.value) ? '' : '님')
</script>

<template>
  <QExpansionItem :expand-separator="expandSeparator" :content-inset-level="1">
    <template #header>
      <QItemSection>
        <QItemLabel class="fd-r ai-c">
          {{ name }}
          <KakaoFeedButton v-if="share && items.length" class="w-[20px] h-[20px]"
                           :description="accountInfo"
                           :content="{
                             profileText: `To. ${name}`,
                             items: shareItems.map(x => ({ itemOp: x.sum + '원', item: x.name })),
                             sum: '합계', sumOp: sum + '원',
                           }" />
        </QItemLabel>
      </QItemSection>
      <QItemSection side><QItemLabel class="selectable">{{ sum }}원</QItemLabel></QItemSection>
    </template>
    <QItem v-for="(item,i) of displayItems" :key="i">
      <QItemSection><QItemLabel class="selectable">{{ item.name }}</QItemLabel></QItemSection>
      <QItemSection side><QItemLabel class="selectable" caption>{{ item.sum }}원</QItemLabel></QItemSection>
    </QItem>
  </QExpansionItem>
</template>
