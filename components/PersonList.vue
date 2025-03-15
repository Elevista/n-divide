<script lang="ts" setup>
const store = useStore(), q = useQuasar()
const showPerson = ref(false)
const person = reactive({ name: '' } satisfies Pick<Person, 'name'>)
const addPerson = (shouldContinue = false) => {
  if (!person.name) return
  store.people.push({ ...person, id: genId() })
  person.name = ''
  if (!shouldContinue) showPerson.value = false
  q.notify({ message: '추가 되었습니다.', position: shouldContinue ? 'top' : 'bottom' })
}
const state = reactive({ moved: 0, bottom: 0, resizing: false })
let lastClientY = 0, min = 0
const move = (e: PointerEvent) => {
  state.moved -= e.clientY - lastClientY
  lastClientY = e.clientY
  if (state.moved < min) state.bottom = min
  else if (state.moved > 0) state.bottom = 0
  else state.bottom = state.moved
}
const clear = () => {
  window.removeEventListener('pointermove', move)
  state.resizing = false
}
const resizeStart = (e: PointerEvent) => {
  const { clientHeight, scrollHeight } = document.scrollingElement!
  min = clientHeight - scrollHeight
  lastClientY = e.clientY
  state.moved = state.bottom
  state.resizing = true
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', clear, { once: true })
  window.addEventListener('pointercancel', clear, { once: true })
}

onUnmounted(() => {
  window.removeEventListener('pointermove', move)
  window.removeEventListener('pointerup', clear)
  window.removeEventListener('pointercancel', clear)
})

const bottom = computed(() => `${state.bottom}px`)
const { resizing } = toRefs(state)
const people = toRef(() => store.people)
</script>
<template>
  <QList bordered separator class="mt-a p-s bc-fff" :class="{resizing}"
         :style="{bottom}">
    <div class="h-4 mt--2 mb--2 c-nsr ta-n" @pointerdown.prevent.stop="resizeStart" />
    <QItemLabel header class="fd-r">
      인원
      <QBtn flat round dense icon="person_add"
            class="ml-a" @click="showPerson=true" />
    </QItemLabel>
    <Flip class="fd-c">
      <Person v-for="x of people" :key="x.id" :person="x" />
    </Flip>
    <div v-if="!people.length" class="f-1 fd-r ai-c jc-c text-body2 pv-20">
      인원을 추가해주세요.
    </div>
  </QList>
  <QDialog v-model="showPerson" position="bottom">
    <QCard>
      <QCardSection class="row items-center q-pb-none">
        <div class="text-h6">인원 추가</div>
        <QSpace />
        <QBtn v-close-popup icon="close" flat round
              dense />
      </QCardSection>

      <QCardSection class="q-pt-none" tag="form" @submit.prevent="addPerson()">
        <QInput v-model="person.name" autofocus label="이름" />
      </QCardSection>

      <QCardActions align="right" class="text-primary">
        <QBtn flat label="계속 추가" :disabled="!person.name" @pointerdown="addPerson(true)" />
        <QBtn v-close-popup flat label="추가" :disabled="!person.name"
              @pointerdown="addPerson()" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
<style scoped lang='less'>
.resizing * {
  transition: none !important;
}

.item {
  background-color: lightblue;
  box-sizing: border-box;
  border: 1px solid #333;
}

</style>
