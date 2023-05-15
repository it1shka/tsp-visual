import Canvas from './canvas'
import { removeElement } from './utils'
import Vertex from './vertex'

function resizeCanvas() {
  Canvas.element.width = window.innerWidth
  Canvas.element.height = window.innerHeight
}
window.onresize = resizeCanvas
resizeCanvas()

const vertices = new Array<Vertex>()

function addNewVertex({ clientX, clientY }: MouseEvent) {
  const vertex = new Vertex([clientX, clientY])
  vertices.push(vertex)
  vertex.element.ondblclick = () => {
    document.body.removeChild(vertex.element)
    removeElement(vertices, vertex)
  }
}
Canvas.element.onclick = addNewVertex

setInterval(() => {
  Canvas.clear()
  Canvas.drawGrid()
}, 60)