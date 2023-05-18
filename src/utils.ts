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
  const index = randint(0, array.length)
  return array[index]
}

export function maybe<T>(probability: number, action: () => T) {
  if (randfloat(0, 100) < probability) {
    return action()
  }
  return null
}

export function removeElement<T>(array: T[], ...elements: T[]) {
  for (const elem of elements) {
    const index = array.indexOf(elem)
    if (index === -1) continue
    array.splice(index, 1)
  }
}

export function sleep(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time)
  })
}

export const RandomNameGenerator = new class {
  private readonly prefixChance = 30
  private readonly prefixes = [ 'New', 'Old', 'North', 'South', 'West', 'East', 'Royal', 'Saint' ]
  private readonly roots = [ 'Func', 'Def', 'Fork', 'Spoon', 'Bale', 'Wolf', 'Moth', 'Brew', 'Raven', 'Pork', 'Kasia', 'Mateusz' ]
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

export const Keyboard = new class {
  readonly listeners = new Map<string, Array<() => any>>()

  constructor () {
    window.addEventListener('keydown', this.onKeyClick)
  }

  private onKeyClick = (event: KeyboardEvent) => {
    const bucket = this.getBucket(event.key)
    if (bucket.length > 0) event.preventDefault() 
    bucket.forEach(action => action())
  }
  
  private getBucket(key: string) {
    const maybeBucket = this.listeners.get(key)
    if (maybeBucket === undefined) {
      const bucket: Array<() => any> = []
      this.listeners.set(key, bucket)
      return bucket
    }
    return maybeBucket
  }

  addEventListener(key: string, action: () => any) {
    const bucket = this.getBucket(key)
    bucket.push(action)
    return action
  }

  removeEventListener(key: string, action: () => any) {
    const bucket = this.getBucket(key)
    return removeElement(bucket, action)
  }
}()

export function trackableArray<T>(source: T[]) {
  const tracker = new Array<T[]>()
  const proxy = new Proxy(source, {
    set(target, property, value, receiver) {
      const result = Reflect.set(target, property, value, receiver)
      if (property === 'length') {
        tracker.push([ ...target ])
      }
      return result
    }
  })
  return [proxy, tracker] as const
}

export function dist([x1, y1]: Position, [x2, y2]: Position) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export class DisjointSet<T> {
  private readonly parent = new Map<T, T>()
  private readonly rank = new Map<T, number>()
  private _size = 0

  constructor(...elements: T[]) {
    elements.forEach(elem => this.makeSet(elem))
  }

  makeSet(element: T) {
    if (this.parent.has(element)) return
    this.parent.set(element, element)
    this.rank.set(element, 0)
    this._size++
  }

  findParent(element: T) {
    if (!this.parent.has(element)) {
      return null
    }
    const currentParent = this.parent.get(element)!
    if (currentParent !== element) {
      this.parent.set(element, this.findParent(currentParent)!)
    }
    return this.parent.get(element)!
  }

  union(x: T, y: T) {
    if (!this.parent.has(x) || !this.parent.has(y)) {
      return false
    }

    const parentX = this.findParent(x)!
    const parentY = this.findParent(y)!

    if (parentX === parentY) return false

    const rankX = this.rank.get(parentX)!
    const rankY = this.rank.get(parentY)!

    if (rankX < rankY) {
      this.parent.set(parentX, parentY)
    } else if (rankY < rankX) {
      this.parent.set(parentY, parentX)
    } else {
      this.parent.set(parentX, parentY)
      this.rank.set(parentY, rankY + 1)
    }
    this._size--

    return true
  }

  get size() {
    return this._size
  }
}

export function uniquePairs<T>(array: T[]) {
  const output = new Array<readonly [T, T]>()
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      const pair = [array[i], array[j]] as const
      output.push(pair)
    }
  }
  return output
}

export function minBy<T>(array: T[], selector: (elem: T) => number) {
  let output: T | null = null
  let value = Infinity
  for (const each of array) {
    const currentValue = selector(each)
    if (currentValue < value) {
      output = each
      value = currentValue
    }
  }
  return output
}

export function maxBy<T>(array: T[], selector: (elem: T) => number) {
  let output: T | null = null
  let value = -Infinity
  for (const each of array) {
    const currentValue = selector(each)
    if (currentValue > value) {
      output = each
      value = currentValue
    }
  }
  return output
}

// the following piece of code was stolen
// from stackoverflow
// so i have no idea how it works
export function intersects([[a,b],[c,d]]: Edge, [[p,q],[r,s]]: Edge) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}

export function costOfPath(edges: Edge[]) {
  const vertices = (edges as unknown as Array<Position[]>)
    .reduce((acc, [a, b]) => [...acc, a, b], [])
  const groups = new DisjointSet(...new Set(vertices))
  let totalDistance = 0
  for (const edge of edges) {
    totalDistance += dist(...edge)
    groups.union(...edge)
  }
  if (groups.size > 1) return Infinity
  return totalDistance
}