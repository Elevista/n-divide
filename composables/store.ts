import { parse, stringify } from 'flatted'

export type N = {id: number, personId?: number, itemId: number}
export type Item = {
  count: number,
  n: N[],
  price: number,
  name: string,
  id: number,
}
export type Person = { name: string, id: number }

export const useStore = () => useState(() => {
  const people: Person[] = []
  const items: Item[] = []
  return {
    lastId: 0,
    people,
    items,
    draggingN: undefined as N|undefined,
    editMode: false,
    showResult: false,
    accountInfo: '',
  }
}).value

export const giveToPerson = (person: Person, n = useStore().draggingN) => {
  if (!n) return
  if (n.personId && n.personId !== person.id) notifyUndo('이동 되었습니다.')
  n.personId = person.id
}

export const removeNFromPerson = (n = useStore().draggingN) => {
  if (n) n.personId = undefined
}

export const deleteN = (n: N) => {
  const item = useStore().items.find(x => x.id === n.itemId)
  if (item) removeItem(item.n, x => x.id === n.id)
}

export type SimpleData = {
  items: ({name: string, sum: number})[],
  people: ({
    name: string,
    items: ({name: string, sum: number})[]
  })[]
}
export const useSimpleData = (): SimpleData => reactive({
  items: computed(() => useStore().items.map(item => ({
    name: item.name,
    sum: item.price * item.count,
  }))),
  people: computed(() => useStore().people.map(person => ({
    name: person.name,
    items: useStore().items.flatMap(item => {
      const { n, price, name } = item
      const count = n.filter(x => x.personId === person.id).length
      if (!count) return { name, sum: 0 }
      const sum = ((price * item.count) * (count / n.length))
      return { name, sum }
    }),
  })).filter(x => x.items.filter(x => x.sum).length)),
})

export const notifyUndo = (message: string) => {
  const store = useStore(), data = stringify(store)
  Notify.create({
    message,
    timeout: 2000,
    actions: [{ label: '되돌리기', handler: () => { Object.assign(store, parse(data)) } }],
  })
}
