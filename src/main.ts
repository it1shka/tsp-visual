import * as Actions from './actions'
import * as Algorithms from './algorithms'
import Canvas from './canvas'
import { Edge, Keyboard, randpos, removeElement, sleep, trackableArray } from './utils'
import Vertex from './vertex'

export default new class Main {
  private readonly vertices = new Array<Vertex>()
  private busy = false

  private history = new Array<Edge[]>()
  private historyPointer = -1

  constructor() {
    this.makeCanvasResizable()
    this.enableVertexAddition()
    this.bindMenu()
    this.bindAlgorithmPanel()
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

  private bindAlgorithmPanel() {
    const panel = document.querySelector('.algorithm-panel')
    if (panel === null) {
      throw new Error('Failed to bind algorithm panel')
    }
    const algorithmElements = panel.querySelectorAll('li')
    algorithmElements.forEach(elem => {
      const algorithmAttr = elem.getAttribute('algorithm')
      if (algorithmAttr === null) return
      if (!(algorithmAttr in Algorithms)) return
      type AlgorithmName = keyof typeof Algorithms
      const algorithm = Algorithms[algorithmAttr as unknown as AlgorithmName]

      elem.onclick = () => {
        if (this.busy) return
        const [edges, history] = trackableArray<Edge>([])
        const positions = this.vertices.map(vertex => vertex.position)
        algorithm(positions, edges)
        this.history = history
        this.historyPointer = -1
      }
    })
  }

  private startCanvasLoop() {
    setInterval(() => {
      Canvas.clear()
      Canvas.drawGrid()

      const state = this.history[this.historyPointer]
      if (!state) return
      state.forEach(edge => Canvas.drawEdge(edge))
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
    if (this.busy) return
    const last = this.vertices.pop()
    if (last === undefined) return
    this.removeVertex(last)
  }

  private readonly runDelay = 100
  runAlgorithm = async () => {
    if (this.busy) return
    this.busy = true
    while (this.historyPointer < this.history.length - 1) {
      this.historyPointer++
      await sleep(this.runDelay)
    }
    this.busy = false
  }

  nextStep = () => {
    if (this.historyPointer >= this.history.length) return
    this.historyPointer++
  }

  prevStep = () => {
    if (this.historyPointer < -1) return
    this.historyPointer--
  }
}()