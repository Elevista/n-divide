// eslint-disable-next-line no-use-before-define
export type N = {id: number, who?: Person, item: Item}
export type Item = {
  count: number,
  n: N[],
  price: number,
  name: string,
  id: number,
}
export type Person = { name: string, id: number, n: N[] }

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
  if (n.who) removeItem(n.who.n, x => x.id === n.id)
  n.who = person
  person.n.push(n)
}

export const removeNFromPerson = (n = useStore().draggingN) => {
  if (!n?.who) return
  removeItem(n.who.n, x => x.id === n.id)
  n.who = undefined
}

export const deleteN = (n: N) => {
  const item = n.item
  if (n.who) removeItem(n.who.n, x => x.id === n.id)
  removeItem(item.n, x => x.id === n.id)
}
