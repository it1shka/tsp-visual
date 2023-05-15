import * as Actions from './actions'
import Canvas from './canvas'
import { Keyboard, randpos, removeElement, sleep } from './utils'
import Vertex from './vertex'

export default new class Main {
  private readonly vertices = new Array<Vertex>()

  constructor() {
    this.makeCanvasResizable()
    this.enableVertexAddition()
    this.enableKeyBindings()
    this.startCanvasLoop()
  }

  private makeCanvasResizable() {
    function resizeCanvas() {
      Canvas.element.width = window.innerWidth
      Canvas.element.height = window.innerHeight
    }
    window.onresize = resizeCanvas
    resizeCanvas()
  }

  private enableVertexAddition() {
    Canvas.element.onclick = ({ clientX, clientY }: MouseEvent) => {
      const vertex = new Vertex([clientX, clientY])
      this.addVertex(vertex)
    }
  }

  private enableKeyBindings() {
    Keyboard.addEventListener('p', Actions.randomizeAction)
    Keyboard.addEventListener('c', Actions.clearAction)
    Keyboard.addEventListener('z', Actions.removeLastAction)
  }

  private addVertex(vertex: Vertex) {
    this.vertices.push(vertex)
    vertex.element.ondblclick = () => {
      this.removeVertex(vertex)
    }
  }

  private removeVertex(vertex: Vertex) {
    document.body.removeChild(vertex.element)
    removeElement(this.vertices, vertex)
  }

  private startCanvasLoop() {
    setInterval(() => {
      Canvas.clear()
      Canvas.drawGrid()
    }, 60)
  }

  // actions
  private readonly randomizeDelay = 25
  randomizeMap = async (count: number) => {
    for (let i = 0; i < count; i++) {
      const position = randpos()
      const vertex = new Vertex(position)
      this.addVertex(vertex)
      await sleep(this.randomizeDelay)
    }
  }

  private readonly clearDelay = 25
  clear = async () => {
    for (const each of [ ...this.vertices ]) {
      this.removeVertex(each)
      await sleep(this.clearDelay)
    }
  }

  removeLast = () => {
    const last = this.vertices.pop()
    if (last === undefined) return
    this.removeVertex(last)
  }
}()