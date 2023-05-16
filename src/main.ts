import * as Actions from './actions'
import Canvas from './canvas'
import { Keyboard, randpos, removeElement, sleep } from './utils'
import Vertex from './vertex'

export default new class Main {
  private readonly vertices = new Array<Vertex>()
  private busy = false

  constructor() {
    this.makeCanvasResizable()
    this.enableVertexAddition()
    this.bindMenu()
    this.startCanvasLoop()
  }

  // init functions
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

  private bindMenu() {
    const menu = document.querySelector('.action-menu')
    if (menu === null) {
      throw new Error('Failed to bind menu')
    }
    const shortcutPreview = document.querySelector('.action-menu__shortcut-preview')
    if (shortcutPreview === null) {
      throw new Error('Failed to get shortcut preview')
    }
    const buttons = menu.querySelectorAll('li')
    buttons.forEach(button => {
      const action = button.getAttribute('action')
      if (action === null) return
      if (action in Actions) {
        type ActionType = keyof typeof Actions
        const actionFunction = Actions[action as unknown as ActionType]
        button.onclick = actionFunction
        const keybinding = button.getAttribute('key')
        if (keybinding !== null) {
          Keyboard.addEventListener(keybinding, actionFunction)
          button.onmouseenter = () => {
            shortcutPreview.textContent = `Uses [${keybinding === ' ' ? 'Space' : keybinding}] as keybinding`
            shortcutPreview.classList.remove('hidden')
          }
          button.onmouseleave = () => {
            shortcutPreview.classList.add('hidden')
          }
        }
      }
    })
    const toggleButton = document.querySelector('.action-menu-open-button')
    if (toggleButton === null) {
      throw new Error('Failed to bind toggle button')
    }
    (toggleButton as HTMLElement).onclick = Actions.toggleMenuAction
  }

  private startCanvasLoop() {
    setInterval(() => {
      Canvas.clear()
      Canvas.drawGrid()
    }, 60)
  }

  // private methods
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

  // actions
  private readonly randomizeDelay = 25
  randomizeMap = async (count: number) => {
    if (this.busy) return
    this.busy = true
    for (let i = 0; i < count; i++) {
      const position = randpos()
      const vertex = new Vertex(position)
      this.addVertex(vertex)
      await sleep(this.randomizeDelay)
    }
    this.busy = false
  }

  private readonly clearDelay = 25
  clear = async () => {
    if (this.busy) return
    this.busy = true
    for (const each of [ ...this.vertices ]) {
      this.removeVertex(each)
      await sleep(this.clearDelay)
    }
    this.busy = false
  }

  removeLast = () => {
    const last = this.vertices.pop()
    if (last === undefined) return
    this.removeVertex(last)
  }
}()