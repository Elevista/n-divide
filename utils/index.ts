import { parse as qsParse, stringify as qsStringify } from 'qs'
import type { NamedColor } from 'quasar'

export type PartialProps<Obj, Keys extends keyof Obj> = Omit<Obj, Keys> & {[K in Keys]?: Obj[K]}

export const numberFormat = (value: number) => new Intl.NumberFormat().format(value)
export const intFormat = (value: number) => numberFormat(Math.floor(value))
export const numberRef = (ref: Ref<number|undefined>) => computed({
  get: () => ref.value === undefined ? undefined : numberFormat(ref.value),
  set: (v: string) => {
    const n = +v.replace(/,/g, '')
    ref.value = (v === '' || isNaN(n)) ? undefined : n
  },
})

export const genId = () => useStore().lastId++

export const removeItem = <T>(arr: T[], fn: (item: T) => unknown) =>
  arr.flatMap((x, i) => fn(x) ? i : []).reverse().forEach(i => arr.splice(i, 1))

export const assignIn = <T extends object>(target: T, ...sources: Array<Partial<T>>) => Object.assign(target, ...sources) as T

export const stateOpen = (key = (Math.random() + Math.PI).toString(36)) => new Promise<void>(resolve => {
  history.replaceState({ ...history.state, [key]: 'pop!' }, '')
  history.pushState({}, '')
    const popstate = (event: PopStateEvent) => {
    if (event.state?.[key] !== 'pop!') return
      window.removeEventListener('popstate', popstate)
      resolve()
    }
    window.addEventListener('popstate', popstate)
  })

const colors: NamedColor[] = ['primary', 'secondary', 'red-5', 'pink-5', 'purple-5', 'deep-purple-5', 'indigo-5', 'blue-5', 'light-blue-5', 'cyan-5', 'teal-5', 'green-5', 'light-green-5', 'lime-5', 'yellow-5', 'amber-5', 'orange-5', 'deep-orange-5', 'brown-5', 'grey-5', 'blue-grey-5']
export const getColor = (index: number) => colors[index % colors.length]

const stringifySimpleData = (data: SimpleData) => JSON.stringify([
  data.items.map(item => [item.name, item.sum / 1000]),
  data.people.map(person => [person.name, person.items.map(item => [data.items.findIndex(x => x.name === item.name), item.sum / 1000])]),
])
const parseSimpleData = (str: string): SimpleData | undefined => {
  try {
    const [items, people] = JSON.parse(str) as [[string, number][], [string, [number, number][]][]]
    return {
      items: items.map(([name, sum]) => ({ name, sum: sum * 1000 })),
      people: people.map(([name, arr]) => ({ name, items: arr.map(([i, sum]) => ({ name: items[i][0], sum: sum * 1000 })) })),
    }
  } catch (e) {}
}

export const getShareUrl = (data: SimpleData) => {
  const url = `https://elevista.github.io/n-divide${qsStringify({ data: stringifySimpleData(data) }, { encode: false, addQueryPrefix: true })}`
  return url.length > 1000 ? 'https://elevista.github.io/n-divide' : url
}
export const parseShareUrl = (url: string) => {
  try { return parseSimpleData(String(qsParse(url.split('?')[1]).data)) } catch (e) {}
}
