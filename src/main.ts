import Canvas from './canvas'
import { randpos } from './utils'
import Vertex from './vertex'

function resizeCanvas() {
  Canvas.element.width = window.innerWidth
  Canvas.element.height = window.innerHeight
}

window.onresize = resizeCanvas
resizeCanvas()

for (let i = 0; i < 50; i++) {
  const position = randpos()
  new Vertex(position)
}

setInterval(() => {
  Canvas.clear()
  Canvas.drawGrid()
}, 60)