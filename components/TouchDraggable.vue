<script lang="ts" setup>
import type { CSSProperties } from 'vue'
const props = defineProps<{ draggable?: boolean }>()

const div = ref<HTMLDivElement>(), clone = ref<HTMLElement|null>()

const emit = defineEmits<{
  (e: 'dragstart', event: DragEvent): void
  (e: 'dragend', event: DragEvent): void
  (e: 'contextmenu', event: MouseEvent): void
}>()

const state = reactive({
  isDragging: false,
  start: undefined as Touch | undefined,
  startEvent: undefined as DragEvent | undefined,
})
const touchstart = (e: TouchEvent) => {
  if (!props.draggable) return
  e.preventDefault()
  state.start = e.touches[0]
  state.startEvent = new DragEvent('dragstart', { dataTransfer: new DataTransfer(), bubbles: true, cancelable: true })
  emit('dragstart', state.startEvent)
  clone.value?.remove()
  clone.value = undefined
  const firstChild = div.value?.firstElementChild
  if (!firstChild) return
  const el = clone.value = firstChild.cloneNode(true) as HTMLElement
  document.body.appendChild(clone.value)
  el.addEventListener('contextmenu', e => e.preventDefault())
  assignIn(clone.value.style, { zIndex: '1', position: 'fixed', margin: '0', opacity: '0.8', pointerEvents: 'none' })
  requestAnimationFrame(() => {
    const { left, top } = firstChild.getBoundingClientRect()
    assignIn(el.style, { left: `${left}px`, top: `${top}px` })
  })
}

const style = ref<CSSProperties>()

const touchmove = ({ touches: [moved] }: TouchEvent) => {
  const { start } = state
  if (!start || !clone.value) return
  const deltaX = moved.clientX - start.clientX
  const deltaY = moved.clientY - start.clientY
  clone.value.style.transform = `translate(${deltaX}px, ${deltaY}px)`
}

const touchend = ({ changedTouches: [moved], currentTarget }: TouchEvent) => {
  clone.value?.remove()
  clone.value = undefined
  const { start } = state
  style.value = undefined
  state.start = undefined
  if (!start || !(currentTarget instanceof HTMLElement)) return
  const el = document.elementsFromPoint(moved.clientX, moved.clientY)
    .find(el => el !== currentTarget && !currentTarget?.contains(el))
  if (!el) return
  const dataTransfer = state.startEvent?.dataTransfer ?? new DataTransfer()
  const dropEvent = new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true })
  el.dispatchEvent(dropEvent)
  emit('dragend', new DragEvent('dragend', { dataTransfer, bubbles: true, cancelable: true }))
}

const listeners = {
  dragstart: (e: DragEvent) => emit('dragstart', e),
  dragend: (e: DragEvent) => emit('dragend', e),
  contextmenu: (e: MouseEvent) => { e.preventDefault(); emit('contextmenu', e) },
}

const remove = () => {
  clone.value?.remove()
  clone.value = undefined
}
onMounted(() => { window.addEventListener('blur', remove) })
onUnmounted(() => { window.removeEventListener('blur', remove) })

</script>
<template>
  <div ref="div" class="contents ta-n"
       @touchstart.stop="touchstart"
       @touchmove.passive.stop="touchmove"
       @touchend.passive.stop="touchend"><slot :style="style" :listeners="listeners" /></div>
</template>
