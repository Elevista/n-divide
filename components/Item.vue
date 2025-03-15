<script lang="ts" setup>
const props = defineProps<{ editMode?: boolean, item: Item }>()
const store = useStore(), show = ref(false)
const editMode = toRef(store, 'editMode')

const totalPrice = computed(() => props.item.price * props.item.count)
const appearItems = computed(() => props.item.n.filter(x => !x.personId))

const remove = () => {
  notifyUndo('삭제 되었습니다.')
  const { item } = props
  item.n.slice().forEach(deleteN)
  removeItem(store.items, x => x.id === item.id)
}
</script>
<template>
  <div>
    <QItemLabel header class="flex ai-c">
      <button type="button" class="c-i" @click="show=true">{{ item.name }}</button>
      <QBtn v-if="editMode" flat round icon="edit"
            dense size="sm" @click="show=true" />
    </QItemLabel>
    <QSlideItem right-color="red" @right="remove">
      <QItem>
        <QItemSection :class="!appearItems.length&&'td-lt'">
          <QItemLabel caption class="flex ai-c">
            <button type="button" class="c-i" @click="show=true">{{ numberFormat(totalPrice) }}원({{ numberFormat(item.count) }}개)</button> &nbsp;/ {{ numberFormat(item.n.length) }}분할
          </QItemLabel>
          <QItemLabel v-if="appearItems.length">
            <Flip class="fd-r fw-w"><Pie v-for="x of appearItems" :key="x.id" :n="x" :draggable="!x.personId" /></Flip>
          </QItemLabel>
        </QItemSection>

        <QItemSection side class="fd-r">
          <!-- eslint-disable-next-line vue/no-mutating-props -->
          <QBtn flat round @click="item.n.push({ id: genId(), itemId: item.id })">¹/ₙ</QBtn>
        </QItemSection>
      </QItem>
      <template #right><QIcon name="delete" /></template>
    </QSlideItem>
    <ItemDialog v-model="show" :item="item" />
  </div>
</template>
