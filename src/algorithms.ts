import { DisjointSet, Edge, Position, choice, dist, minBy, removeElement, uniquePairs, maxBy, intersects, costOfPath, permutations } from './utils'

export function nearestNeighborAlgorithm(vertices: Position[], edges: Edge[]) {
  const start = choice(vertices)
  const visited = new Set<Position>()
  visited.add(start)
  let last = start

  while (visited.size < vertices.length) {
    const unvisited = vertices.filter(v => !visited.has(v))
    const best = minBy(unvisited, elem => dist(elem, last))!
    visited.add(best)
    edges.push([last, best])
    last = best
  }
  edges.push([last, start])
}

export function shortestEdgeInsertionAlgorithm(vertices: Position[], edges: Edge[]) {
  const disjointSet = new DisjointSet(...vertices)
  const edgeCount = new Map<Position, number>()
  const sortedEdges = uniquePairs(vertices)
    .sort((a, b) => dist(...a) - dist(...b))
  
  for (const edge of sortedEdges) {
    const [a, b] = edge
    const countA = edgeCount.get(a) ?? 0
    const countB = edgeCount.get(b) ?? 0
    if (countA > 1 || countB > 1) continue
    if (disjointSet.findParent(a) === disjointSet.findParent(b) && disjointSet.size > 1) continue
    edgeCount.set(a, countA + 1)
    edgeCount.set(b, countB + 1)
    disjointSet.union(a, b)
    edges.push(edge)
  }
}

export function nearestInsertionAlgorithm(vertices: Position[], edges: Edge[]) {
  const startEdge = minBy(uniquePairs(vertices), elem => dist(...elem))
  if (startEdge === null) return

  edges.push(startEdge)
  const reached = [ ...startEdge ]

  for (let i = 0; i < vertices.length - 2; i++) {
    const unvisited = vertices.filter(v => !reached.includes(v))
    const closestUnvisited = minBy(unvisited, point => {
      const distancesToPoints = reached.map(e => dist(point, e))
      return Math.min(...distancesToPoints)
    })!
    const closestEdge = minBy(edges, ([a, b]) => {
      return dist(a, closestUnvisited) + dist(b, closestUnvisited) - dist(a, b)
    })!
    const [start, end] = closestEdge
    if (edges.length > 1) {
      removeElement(edges, closestEdge)
    }
    edges.push([start, closestUnvisited])
    edges.push([closestUnvisited, end])
    reached.push(closestUnvisited)
  }
}

export function farthestInsertionAlgorithm(vertices: Position[], edges: Edge[]) {
  const startEdge = maxBy(uniquePairs(vertices), elem => dist(...elem))
  if (startEdge === null) return

  edges.push(startEdge)
  const reached = [ ...startEdge ]

  for (let i = 0; i < vertices.length - 2; i++) {
    const unvisited = vertices.filter(v => !reached.includes(v))
    const farthestUnvisited = maxBy(unvisited, point => {
      const distancesToPoints = reached.map(e => dist(point, e))
      return Math.min(...distancesToPoints)
    })!
    const closestEdge = minBy(edges, ([a, b]) => {
      return dist(a, farthestUnvisited) + dist(b, farthestUnvisited) - dist(a, b)
    })!
    const [start, end] = closestEdge
    if (edges.length > 1) {
      removeElement(edges, closestEdge)
    }
    edges.push([start, farthestUnvisited])
    edges.push([farthestUnvisited, end])
    reached.push(farthestUnvisited)
  }
}

export function randomInsertionAlgorithm(vertices: Position[], edges: Edge[]) {
  const startEdge = choice(uniquePairs(vertices))
  if (startEdge === null) return

  edges.push(startEdge)
  const reached = [ ...startEdge ]

  for (let i = 0; i < vertices.length - 2; i++) {
    const unvisited = vertices.filter(v => !reached.includes(v))
    const randomUnvisited = choice(unvisited)
    const closestEdge = minBy(edges, ([a, b]) => {
      return dist(a, randomUnvisited) + dist(b, randomUnvisited) - dist(a, b)
    })!
    const [start, end] = closestEdge
    if (edges.length > 1) {
      removeElement(edges, closestEdge)
    }
    edges.push([start, randomUnvisited])
    edges.push([randomUnvisited, end])
    reached.push(randomUnvisited)
  }
}

export function twoOptAlgorithm(vertices: Position[], edges: Edge[]) {
  nearestNeighborAlgorithm(vertices, edges)
  while (true) {

    const originalCost = costOfPath(edges)
    let wasOptimized = false

    const pairs = uniquePairs(edges).filter(pair => intersects(...pair))
    outer: for (const pair of pairs) {
      const [[start1, end1], [start2, end2]] = pair
      const possibility1 = [[start1, end2], [start2, end1]] as const
      const possibility2 = [[start1, start2], [end1, end2]] as const
      for (const each of [possibility1, possibility2]) {
        const alternative = [...edges]
        removeElement(alternative, ...pair)
        alternative.push(...each)
        const newCost = costOfPath(alternative)
        if (newCost < originalCost) {
          removeElement(edges, ...pair)
          edges.push(...each)
          wasOptimized = true
          break outer
        }
      }
    }

    if (!wasOptimized) break
  }
}

export function kOptAlgorithm(vertices: Position[], edges: Edge[]) {
  nearestNeighborAlgorithm(vertices, edges)
  let k = Number(window.prompt('Please, select k for k-opt algorithm'))
  if (isNaN(k) || k < 2) k = 3 
  let limit = Number(window.prompt('Please, select limit for k-opt algorithm'))
  if (isNaN(limit) || limit < 10_000) limit = 10_000
  let iterations = 0
  while (iterations < limit) {
    const originalCost = costOfPath(edges)
    let wasOptimized = false
    const pairs = uniquePairs(edges).filter(pair => intersects(...pair))
    const intersectedEdges = [...new Set(pairs.flat())]
    if (intersectedEdges.length === 0) break

    outer: for (const permutation of permutations(intersectedEdges, Math.min(k, intersectedEdges.length))) {
      const vertices = permutation.flat()
      for (const flattenedEdges of permutations(vertices)) {
        const alternative = [...edges]
        removeElement(alternative, ...permutation)
        for (let i = 0; i < flattenedEdges.length; i += 2) {
          alternative.push([flattenedEdges[i], flattenedEdges[i + 1]])
        }
        const newCost = costOfPath(alternative)
        if (newCost < originalCost) {
          removeElement(edges, ...permutation)
          for (let i = 0; i < flattenedEdges.length; i += 2) {
            edges.push([flattenedEdges[i], flattenedEdges[i + 1]])
          } 
          wasOptimized = true
          break outer
        }
        iterations++
        if (iterations >= limit) break outer
      }
    }

    if (!wasOptimized) break
  }
}

// this is a function that I will in christofides algorithm
export function createMinimalSpanningTree(vertices: Position[], edges: Edge[]) {
  // its using kruskal algorithm
  const sortedEdges = uniquePairs(vertices).sort((a, b) => dist(...a) - dist(...b))
  const disjointSet = new DisjointSet(...vertices)
  for (const edge of sortedEdges) {
    const [start, end] = edge
    if (disjointSet.findParent(start) !== disjointSet.findParent(end)) {
      edges.push(edge)
      disjointSet.union(start, end)
    }
  }
}