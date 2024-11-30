<script setup lang="ts">
import 'assets/common.less'
import 'assets/font/pretendardvariable.css'
import kor from 'quasar/lang/ko-KR.js'
import { stringify, parse } from 'flatted'

useQuasar().lang.set(kor)
Notify.setDefaults({ timeout: 450 })

const store = useStore()
if (localStorage.store) {
  Object.assign(store, parse(localStorage.store))
  delete localStorage.store
}
onMounted(() => {
  window.addEventListener('beforeunload', () => { localStorage.store = stringify(store) })
  window.addEventListener('blur', () => {
    if (document.visibilityState === 'hidden') localStorage.store = stringify(store)
  })
})
</script>
<template>
  <Transition>
    <KeepAlive>
      <Results v-if="store.showResult" class="results" />
      <span v-else class="d-c"><App /></span>
    </KeepAlive>
  </Transition>
</template>
<style lang="less" scoped>
.v-enter-active, .v-leave-active {
  transition: all .3s cubic-bezier(0.36,0.66,0.04,1);
}
.results {
  &.v-enter-active, &.v-leave-active {
    position: fixed;
    inset: 0 0 0 0;
    z-index: 1;
  }

  &.v-enter-from, &.v-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }

  &.v-enter-to, &.v-leave-from {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
