<script lang="ts" setup>
const props = defineProps<{ editMode?: boolean, item: Item }>()
const state = reactive(props.item), store = useStore(), show = ref(false)
const editMode = toRef(store, 'editMode')

const totalPrice = computed(() => state.price * state.count)
const appearItems = computed(() => state.n.filter(x => !x.who))

const remove = () => {
  const { item } = props
  item.n.slice().forEach(deleteN)
  removeItem(store.items, x => x.id === item.id)
}

const { name, n, count } = toRefs(state)
</script>
<template>
  <div>
    <QItemLabel header class="flex ai-c">
      <button type="button" class="c-i" @click="show=true">{{ name }}</button>
      <QBtn v-if="editMode" flat round icon="edit"
            dense size="sm" @click="show=true" />
    </QItemLabel>
    <QSlideItem right-color="red" @right="remove">
      <QItem>
        <QItemSection :class="!appearItems.length&&'td-lt'">
          <QItemLabel caption class="flex ai-c">
            <button type="button" class="c-i" @click="show=true">{{ numberFormat(totalPrice) }}원({{ numberFormat(count) }}개)</button> &nbsp;/ {{ numberFormat(n.length) }}분할
          </QItemLabel>
          <QItemLabel v-if="appearItems.length">
            <Flip class="fd-r fw-w"><Pie v-for="x of appearItems" :key="x.id" :n="x" :draggable="!x.who" /></Flip>
          </QItemLabel>
        </QItemSection>

        <QItemSection side class="fd-r">
          <QBtn flat round @click="n.push({id:genId(),item:props.item})">¹/ₙ</QBtn>
        </QItemSection>
      </QItem>
      <template #right><QIcon name="delete" /></template>
    </QSlideItem>
    <ItemDialog v-model="show" :item="item" />
  </div>
</template>
