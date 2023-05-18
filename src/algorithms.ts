import { DisjointSet, Edge, Position, choice, dist, minBy, removeElement, uniquePairs, maxBy, intersects, costOfPath } from './utils'

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
    const unoptimal = uniquePairs(edges).filter(([a, b]) => intersects(a, b))
    if (unoptimal.length === 0) break
    let improved = false
    for (const optimization of unoptimal) {
      const [a, b] = optimization
      const [start1, end1] = a
      const [start2, end2] = b
      const currentCost = costOfPath(edges)

      let alternative = [ ...edges ]
      const newEdge1: Edge = [start1, start2]
      const newEdge2: Edge = [end1, end2]
      removeElement(alternative, a, b)
      alternative.push(newEdge1, newEdge2)
      if (costOfPath(alternative) < currentCost) {
        removeElement(edges, a, b)
        edges.push(newEdge1, newEdge2)
        improved = true
        break
      }

      alternative = [ ...edges ]
      const newEdge3: Edge = [start1, end2]
      const newEdge4: Edge = [start2, end1]
      removeElement(alternative, a, b)
      alternative.push(newEdge3, newEdge4)
      if (costOfPath(alternative) < currentCost) {
        removeElement(edges, a, b)
        edges.push(newEdge3, newEdge4)
        improved = true
        break
      }
    }
    if (!improved) break
  }
}
