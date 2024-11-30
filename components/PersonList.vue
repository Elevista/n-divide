<script lang="ts" setup>
const store = useStore(), q = useQuasar()
const { people } = store
const showPerson = ref(false)
const person = reactive<Person>({ name: '', id: NaN, n: [] })
const addPerson = (shouldContinue = false) => {
  if (!person.name) return
  store.people.push({ name: person.name, id: genId(), n: [] })
  person.name = ''
  if (!shouldContinue) showPerson.value = false
  q.notify({ message: '추가 되었습니다.', position: shouldContinue ? 'top' : 'bottom' })
}
</script>
<template>
  <QList bordered separator class="mt-a p-s bottom-0 bc-fff">
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
.container {
  display: grid;

  height: 400px; /* 부모 높이 설정 */
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  overflow: hidden; /* 부모의 높이를 넘는 자식은 숨김 */
  gap:0;
}

.item {
  background-color: lightblue;
  box-sizing: border-box;
  border: 1px solid #333;
}

</style>
