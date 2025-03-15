<script lang="ts" setup>
const props = defineProps<{ person: Person }>()
const store = useStore()
const n = computed(() => props.person.n.slice().sort((a, b) => a.item.id - b.item.id))
const removePerson = () => {
  notifyUndo('삭제 되었습니다.')
  const n = props.person.n.slice()
  removeItem(store.people, x => x.id === props.person.id)
  n.forEach(n => { n.who = undefined })
}
const name = toRef(props.person, 'name')
</script>

<template>
  <QSlideItem right-color="red" @right="removePerson">
    <QItem @dragover.prevent @drop="giveToPerson(person)" @right="removePerson">
      <QItemSection>
        <QItemLabel overline class="flex ai-c">
          {{ person.name }}
          <QPopupEdit v-slot="scope" v-model="name" auto-save>
            <QInput v-model="scope.value" dense autofocus counter
                    @keyup.enter="scope.set" />
          </QPopupEdit>
        </QItemLabel>
        <QItemLabel>
          <Flip class="fd-r fw-w"><Pie v-for="x of n" :key="x.id" :n="x" draggable /></Flip>
        </QItemLabel>
      </QItemSection>

      <QItemSection v-if="store.editMode" side>
        <QBtn flat round icon="close" size="sm"
              @click="removePerson" />
      </QItemSection>
    </QItem>
    <template #right><QIcon name="delete" /></template>
  </QSlideItem>
</template>
