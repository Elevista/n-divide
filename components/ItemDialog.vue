<script lang="ts" setup>
const model = defineModel<boolean|undefined>()
const props = defineProps<{ item?: Item }>()
const q = useQuasar(), store = useStore()
const form = reactive<PartialProps<Item, 'count'|'price'>>({
  n: [],
  name: '',
  id: NaN,
  count: 1,
})

watch(model, value => {
  if (!value) {
    form.name = ''
    form.count = 1
    form.price = undefined
  }

  if (!props.item || !value) return
  const { name, price, count } = props.item
  form.name = name
  form.price = price
  form.count = count
})

const editItem = () => {
  if (!form.name || form.price === undefined || form.count === undefined || !props.item) return
  const edit = props.item
  edit.count = form.count
  edit.price = form.price
  edit.name = form.name
  q.notify('수정 되었습니다.')
  model.value = false
}

const addItem = (shouldContinue = false) => {
  if (props.item) return editItem()
  if (!form.name || form.price === undefined || form.count === undefined) return
  const { count, price, name } = form
  const newItem: Item = {
    name,
    count,
    price,
    id: genId(),
    n: [],
  }
  newItem.n = [{ id: genId(), item: newItem }]
  store.items.push(newItem)
  form.name = ''
  form.count = 1
  form.price = undefined
  if (!shouldContinue) model.value = false
  q.notify({ message: '추가 되었습니다.', position: shouldContinue ? 'top' : 'bottom' })
}

const totalPrice = numberRef(computed({
  get: () => ((form.count ?? 0) * (form.price ?? 0)) || undefined,
  set: (value?: number) => {
    if (value === undefined) form.price = undefined
    else if (form.count === undefined) {
      form.count = 1
      form.price = value
    } else form.price = value / (form.count ?? 1)
  },
}))

const itemPrice = numberRef(toRef(form, 'price'))

const countFocus = (event: Event) => {
  if (form.count === 1 && event.target instanceof HTMLInputElement) event.target.select()
}
const disabled = computed(() => !form.name || form.price === undefined || form.count === undefined)
</script>

<template>
  <QDialog v-model="model" position="bottom">
    <QCard>
      <QCardSection class="row items-center q-pb-none">
        <div class="text-h6">N분 품목 {{ item?'수정':'추가' }}</div>
        <QSpace />
        <QBtn v-close-popup icon="close" flat round
              dense />
      </QCardSection>

      <QCardSection class="q-pt-none" tag="form" @submit.prevent="addItem()">
        <QInput v-model="form.name" autofocus label="명칭" />
        <QInput :model-value="form.count" type="number" label="개수" @focus="countFocus"
                @update:model-value="form.count = $event ? Number($event) : undefined">
          <template #append>
            <QBtn flat round dense icon="add_circle"
                  size="sm" @pointerdown="form.count= +(form.count??0)+1" />
            <QBtn flat round dense icon="remove_circle"
                  :disable="form.count===undefined || form.count<=1"
                  size="sm" @pointerdown="form.count= +(form.count??0)-1" />
          </template>
        </QInput>
        <QInput v-model="itemPrice" inputmode="numeric" label="개당 가격" @keydown.enter.prevent="form.count===1 && addItem()" />
        <QInput v-model="totalPrice" inputmode="numeric" label="총 가격" :disable="form.count===undefined || form.count===1"
                @keydown.enter.prevent="addItem()" />
      </QCardSection>

      <QCardActions align="right" class="text-primary">
        <QBtn v-if="!item" flat label="계속 추가" :disabled="disabled"
              @pointerdown="addItem(true)" />
        <QBtn flat :label="item?'수정':'추가' " :disabled="disabled" @pointerdown="addItem()" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
