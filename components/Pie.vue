<script lang="ts" setup>
const props = defineProps<{ n: N, draggable?: boolean }>()
const store = useStore()
const item = computed(() => store.items.find(x => x.id === props.n.itemId) ?? store.items[0])
const itemPrice = computed(() => numberFormat(Math.ceil((item.value.price * item.value.count) / item.value.n.length)))

const dragstart = (e: DragEvent) => {
  store.draggingN = props.n
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

const editMode = toRef(store, 'editMode')

const color = computed(() => getColor(store.items.findIndex(x => x.id === item.value.id)))
</script>

<template>
  <TouchDraggable v-slot="{style,listeners}" class="d-i"
                  :draggable="draggable&&!editMode"
                  @dragstart="dragstart" @dragend="store.draggingN=undefined"
                  @contextmenu="store.draggingN=undefined">
    <QChip :style="style" :draggable="draggable&&!editMode" :color="color"
           text-color="white"
           :removable="editMode" icon="local_pizza"
           class="p-r ta-n" :class="editMode&&'shake'"
           @remove="deleteN(n)" v-on="listeners">
      {{ item.name }}
      <QBadge v-if="!editMode" color="red" floating transparent>{{ itemPrice }}</QBadge>
    </QChip>
  </TouchDraggable>
</template>

<style lang="less" scoped>
.shake {
  @keyframes shakeX {
    from,
    to {
      transform: translate3d(0, 0, 0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate3d(-2px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
  }
  // animation: name duration timing-function delay iteration-count direction fill-mode;
  animation: shakeX 1.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
}
</style>
