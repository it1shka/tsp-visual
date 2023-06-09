import * as Actions from './actions'
import * as Algorithms from './algorithms'
import Canvas from './canvas'
import { Position, Edge, Keyboard, randpos, removeElement, sleep, trackableArray, notification, costOfPath, pushToHistory } from './utils'
import Vertex from './vertex'

type Algorithm = (vertices: Position[], edges: Edge[]) => void

export default new class Main {
  private readonly vertices = new Array<Vertex>()
  private busy = false
  private algorithm: Algorithm | null = null
  private edges: Edge[] | null = null

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
      if (algorithm === this.algorithm) {
        elem.classList.add('active')
      }

      elem.onclick = () => {
        algorithmElements.forEach(elem => elem.classList.remove('active'))

        if (algorithm === this.algorithm) {
          this.algorithm = null
          elem.classList.remove('active')
          return
        }
        this.algorithm = algorithm
        elem.classList.add('active')
      }
    })
  }

  private startCanvasLoop() {
    setInterval(() => {
      Canvas.clear()
      Canvas.drawGrid()
      if (!this.edges) return
      this.edges.forEach(edge => Canvas.drawEdge(edge))
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

  clearEdges = () => {
    if (this.busy) return
    this.edges = null
  }

  removeLast = () => {
    if (this.busy) return
    const last = this.vertices.pop()
    if (last === undefined) return
    this.removeVertex(last)
  }

  private runDelay = 100
  private readonly minRunDelay = 20
  private readonly maxRunDelay = 2000
  private readonly delayStep = 25
  increaseShowSpeed = () => {
    this.runDelay = Math.max(this.minRunDelay, this.runDelay - this.delayStep)
  }

  decreaseShowSpeed = () => {
    this.runDelay = Math.min(this.maxRunDelay, this.runDelay + this.delayStep)
  }

  runAlgorithm = async () => {
    if (this.busy || !this.algorithm || this.vertices.length < 2) return
    this.busy = true
    notification('Running algorithm...')
    const vertices = this.vertices.map(vertex => vertex.position)
    const [edges, history] = trackableArray<Edge>([])
    this.algorithm(vertices, edges)
    for (const record of history) {
      this.edges = record
      await sleep(this.runDelay)
    }
    const totalLength = Math.round(costOfPath(edges))
    notification(`Total length: ${totalLength}`)
    pushToHistory(`"${this.algorithm.name}": ${totalLength}`)
    this.busy = false
  }
}()