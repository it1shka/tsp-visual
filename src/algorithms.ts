import { Edge, Position, choice, dist } from './utils'

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
  
}