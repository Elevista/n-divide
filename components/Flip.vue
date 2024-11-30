<script setup lang="ts">
import { throttle } from 'lodash-es'
const emit = defineEmits<{(e: 'afterLeave', v: Element): void}>()
const props = withDefaults(defineProps<{tag?: string, disable?: boolean, appear?: boolean}>(), { tag: 'span' })
const keepOffset = (node: Node) => {
  if (node instanceof HTMLElement) {
    const { dataset, offsetTop, offsetLeft } = node
    Object.assign(dataset, { offsetTop, offsetLeft })
  }
}
const prepare = throttle(function (first: HTMLElement) {
  for (let el: Node| null = first; el; el = el.nextSibling) keepOffset(el)
}, 300, { trailing: false })
const beforeLeave = (el: Element) => {
  if (!(el instanceof HTMLElement)) return
  if (props.disable) return
  prepare(el)
  const { offsetTop, offsetLeft } = el.dataset
  Object.assign(el.style, {
    height: `${el.offsetHeight}px`,
    width: `${el.offsetWidth}px`,
    top: `${offsetTop}px`,
    left: `${offsetLeft}px`,
    boxSizing: 'border-box',
  })
}
</script>
<template>
  <TransitionGroup :tag="tag" name="flip-item" class="flip d-c" :class="{disable}"
                   :appear="appear" @before-leave="beforeLeave" @after-leave="emit('afterLeave',$event)">
    <slot />
  </TransitionGroup>
</template>
<style lang="less" scoped>
.flip:not(.disable)  > :deep(*) {
  will-change: opacity,transform;
  &.flip-item {
    &-enter-active,&-leave-active,&-move{transition: all 300ms cubic-bezier(0.36,0.66,0.04,1);}
    &-move{z-index: 1;}
    &-leave-active { z-index: 0; position: absolute; }
    &-enter-from, &-leave-to{ opacity: 0; }
    &-enter-from{transform: translateY(-20%);}
    &-leave-to{ transform: translateY(20%); }
  }
}
</style>
