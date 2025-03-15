<script lang="ts" setup>
const emit = defineEmits<{ (e: 'itemDialog'): void }>()
const store = useStore(), q = useQuasar()
const editMode = toRef(store, 'editMode')

const sequenceAllocator = () => {
  if (!store.people.length) return q.notify('인원이 없습니다.')
  let gave = 0
  for (const item of store.items) {
    const n = item.n.filter(x => !x.personId)
    for (let i = 0; i < n.length; i++) {
      const person = store.people[i % store.people.length]
      giveToPerson(person, n[i])
      gave++
    }
  }
  q.notify(gave ? '모두 순차적으로 분배되었습니다.' : '분배 할 품목이 없습니다.')
}

const generateNBasedOnPerson = () => {
  let gen = 0
  const { length } = store.people
  for (const item of store.items) {
    if (item.n.length >= length) continue
    for (let i = item.n.length; i < length; i++) {
      item.n.push({ id: genId(), itemId: item.id })
      gen++
    }
  }
  q.notify(gen ? `인원수에 맞춰 ${numberFormat(gen)}개가 생성되었습니다.` : '모든 품목이 이미 인원수 이상 생성되어 있습니다.')
}

const generateNBasedOnCount = () => {
  let gen = 0
  for (const item of store.items) {
    for (let i = item.n.length; i < item.count; i++) {
      item.n.push({ id: genId(), itemId: item.id })
      gen++
    }
  }
  q.notify(gen ? `개수에 맞춰 ${numberFormat(gen)}개가 생성되었습니다.` : '모든 품목이 이미 충분히 생성되어 있습니다.')
}

const reset = () => {
  removeItem(store.items, () => true)
  removeItem(store.people, () => true)
  store.lastId = 0
  store.editMode = false
  q.notify('초기화 되었습니다.')
}

const editModeToggle = () => {
  if (store.editMode) {
    if (history.state?.editMode) history.back()
    else store.editMode = false
  } else {
    store.editMode = true
    stateOpen('editMode')
      .then(() => { store.editMode = false })
  }
}

const showResultModal = () => {
  if (store.showResult) return
  store.showResult = true
  stateOpen('showResult')
    .then(() => { store.showResult = false })
}

const share = () => {
  navigator.clipboard.writeText('https://elevista.github.io/n-divide')
  q.notify({ position: 'top', message: '링크가 클립보드에 복사되었습니다.' })
}
</script>

<template>
  <QToolbar class="p-s top-0 zi-1" :class="editMode?'bg-white':'bg-primary text-white'">
    <QToolbarTitle>N분</QToolbarTitle>
    <QBtn flat round icon="edit" dense
          @click="editModeToggle" />
    <QBtn flat round dense icon="playlist_add"
          @click="emit('itemDialog')" />
    <QBtn flat round dense icon="more_vert">
      <QMenu>
        <QList>
          <QItem v-close-popup clickable @click="sequenceAllocator">
            <QItemSection>전부 순차 분배</QItemSection>

          </QItem>
          <QItem v-close-popup clickable @click="generateNBasedOnPerson">
            <QItemSection class="ws-n">인원수에 맞춰 ¹/ₙ 생성</QItemSection>
          </QItem>
          <QItem v-close-popup clickable @click="generateNBasedOnCount">
            <QItemSection class="ws-n">개수에 맞춰 ¹/ₙ 생성</QItemSection>
          </QItem>
          <QSeparator />
          <QItem v-close-popup clickable @click="reset">
            <QItemSection class="ws-n">초기화</QItemSection>
            <QItemSection side><QIcon name="restart_alt" size="20px" /></QItemSection>
          </QItem>
          <QItem v-close-popup clickable @click="share">
            <QItemSection class="ws-n">공유하기</QItemSection>
            <QItemSection side><QIcon name="link" size="20px" /></QItemSection>
          </QItem>
          <QSeparator />
          <QItem v-close-popup clickable>
            <QItemSection @click="showResultModal">정산 결과 보기</QItemSection>
            <QItemSection side><QIcon name="attach_money" size="20px" /></QItemSection>
          </QItem>
          <QSeparator />
        </QList>
      </QMenu>
    </QBtn>
  </QToolbar>
</template>
