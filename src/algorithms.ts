import { DisjointSet, Edge, Position, choice, dist, uniquePairs } from './utils'

export function nearestNeighborAlgorithm(vertices: Position[], edges: Edge[]) {
  const start = choice(vertices)
  const visited = new Set<Position>()
  visited.add(start)
  let last = start

  while (visited.size < vertices.length) {
    const unvisited = vertices.filter(v => !visited.has(v))
    const best = unvisited
      .sort((a, b) => {
        return dist(b, last) - dist(a, last)
      })
      .pop()!
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