import { Position, RandomColorGenerator, RandomNameGenerator } from './utils'

export default class Vertex {
  readonly element = document.createElement('div')
  readonly name = RandomNameGenerator.getName()
  readonly color = RandomColorGenerator.getColor()

  private _position!: Position
  get position() {
    return this._position
  }
  set position(value) {
    this._position = value
    const [x, y] = value
    const { clientWidth, clientHeight } = this.element
    this.element.style.top = `${y - clientHeight / 2}px`
    this.element.style.left = `${x - clientWidth / 2}px`
  }

  constructor (startPosition: Position) {
    this.createElement()
    this.makeDraggable()
    this.position = startPosition
  }

  private createElement() {
    this.element.classList.add('vertex')

    const body = document.createElement('div')
    body.style.backgroundColor = this.color
    this.element.appendChild(body)

    const title = document.createElement('p')
    title.innerText = this.name
    this.element.appendChild(title)

    document.body.appendChild(this.element)
  }

  private makeDraggable() {
    let mouseStartPosition: Position
    let elementStartPosition: Position

    const onDrag = ({clientX, clientY}: MouseEvent) => {
      const deltaX = mouseStartPosition[0] - clientX
      const deltaY = mouseStartPosition[1] - clientY
      this.position = [elementStartPosition[0] - deltaX, elementStartPosition[1] - deltaY]
    }

    this.element.onmousedown = ({clientX, clientY}) => {
      window.addEventListener('mousemove', onDrag)
      mouseStartPosition = [clientX, clientY]
      elementStartPosition = this.position
      this.element.style.zIndex = '1'
    }

    this.element.onmouseup = () => {
      window.removeEventListener('mousemove', onDrag)
      this.element.style.zIndex = '0'
    }
  }
}