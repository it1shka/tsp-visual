export type Position = readonly [number, number]
export type Edge = readonly [Position, Position]

export function randfloat(start: number, end: number) {
  const delta = end - start
  const rand = Math.random() * delta + start
  return rand
}

export function randint(start: number, end: number) {
  return ~~randfloat(start, end)
}

export function randpos(): Position {
  const x = randfloat(0, window.innerWidth)
  const y = randfloat(0, window.innerHeight)
  return [x, y]
}

export function choice<T>(array: T[]) {
  const index = randint(0, array.length - 1)
  return array[index]
}

export function maybe<T>(probability: number, action: () => T) {
  if (randfloat(0, 100) < probability) {
    return action()
  }
  return null
}

export function removeElement<T>(array: T[], element: T) {
  const index = array.indexOf(element)
  if (index === -1) return false
  array.splice(index, 1)
  return true
}

export const RandomNameGenerator = new class {
  private readonly prefixChance = 30
  private readonly prefixes = [ 'New', 'Old', 'North', 'South', 'West', 'East', 'Royal', 'Saint' ]
  private readonly roots = [ 'Func', 'Def', 'Fork', 'Spoon', 'Bale', 'Wolf', 'Moth', 'Brew', 'Raven', 'Pork' ]
  private readonly postfixes = [ 'ville', 'borough', 'chester', 'ford', 'gate', 'ham', 'minster', 'mouth', 'stead', 'ton', 'wick' ]

  getName() {
    const root = choice(this.roots)
    const postfix = choice(this.postfixes)

    let name = root + postfix
    maybe(this.prefixChance, () => {
      const prefix = choice(this.prefixes)
      name = `${prefix} ${name}`
    })
    return name
  }
}()

export const RandomColorGenerator = new class {
  private readonly colors = [ 
    '#ffcdc9', '#ffe0c9', 
    '#fffac9', '#e2ffc9', 
    '#c9ffd8', '#c9fffe', 
    '#c9daff', '#d9c9ff', 
    '#f9c9ff', '#ffc9d7'
  ]

  getColor() {
    return choice(this.colors)
  }
}()