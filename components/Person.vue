<script lang="ts" setup>
const props = defineProps<{ person: Person }>()
const store = useStore()
const n = computed(() => store.items.flatMap(x => x.n).filter(n => n.personId === props.person.id).slice().sort((a, b) => a.itemId - b.itemId))
const removePerson = () => {
  notifyUndo('삭제 되었습니다.')
  n.value.forEach(n => { n.personId = undefined })
  removeItem(store.people, x => x.id === props.person.id)
}
</script>

<template>
  <QSlideItem right-color="red" @right="removePerson">
    <QItem @dragover.prevent @drop="giveToPerson(person)" @right="removePerson">
      <QItemSection>
        <QItemLabel overline class="flex ai-c">
          {{ person.name }}
          <!-- eslint-disable-next-line vue/no-mutating-props -->
          <QPopupEdit v-slot="scope" v-model="person.name" auto-save>
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
