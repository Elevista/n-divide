<script lang="ts" setup>
const props = defineProps<{person: Person, expandSeparator?: boolean}>()
const { name } = toRefs(props.person)
const store = useStore()
const sum = computed(() => intFormat(props.person.n.reduce((acc, cur) => acc + (cur.item.price * cur.item.count) / cur.item.n.length, 0)))
const items = computed(() => store.items.flatMap(item => {
  const { n, price } = item
  const count = n.filter(x => x.who?.id === props.person.id).length
  if (!count) return []
  const sum = intFormat((price * item.count) * (count / n.length))
  return { ...item, sum }
}))
// const nim = computed(() => /님(?=[^\p{L}\w])/u.test(name.value) ? '' : '님')
</script>

<template>
  <QExpansionItem :expand-separator="expandSeparator" :content-inset-level="1">
    <template #header>
      <QItemSection>
        <QItemLabel class="fd-r ai-c">
          {{ name }}
          <KakaoFeedButton v-if="items.length" class="w-[20px] h-[20px]"
                           :description="store.accountInfo"
                           :content="{
                             profileText: `To. ${name}`,
                             items: items.map(x => ({itemOp: x.sum +'원',item: x.name})),
                             sum:'합계', sumOp: sum + '원',
                           }" />
        </QItemLabel>
      </QItemSection>
      <QItemSection side><QItemLabel class="selectable">{{ sum }}원</QItemLabel></QItemSection>
    </template>
    <QItem v-for="item of items" :key="item.id">
      <QItemSection><QItemLabel class="selectable">{{ item.name }}</QItemLabel></QItemSection>
      <QItemSection side><QItemLabel class="selectable" caption>{{ item.sum }}원</QItemLabel></QItemSection>
    </QItem>
  </QExpansionItem>
</template>
