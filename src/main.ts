import Canvas from './canvas'
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
}
Canvas.element.onclick = addNewVertex

setInterval(() => {
  Canvas.clear()
  Canvas.drawGrid()
}, 60)