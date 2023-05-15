import { Edge, Position } from './utils'

export default new class Canvas {
  readonly element: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D

  constructor () {
    const maybeCanvas = document.querySelector('canvas')
    if (maybeCanvas === null) {
      throw new Error('Failed to find canvas element')
    }
    this.element = maybeCanvas
    const maybeContext = maybeCanvas.getContext('2d')
    if (maybeContext === null) {
      throw new Error('Failed to get rendering context')
    }
    this.ctx = maybeContext
  }

  private drawLine([x1, y1]: Position, [x2, y2]: Position, widtH: number, color: string) {
    this.ctx.lineWidth = widtH
    this.ctx.strokeStyle = color
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  private readonly backgroundColor = '#f2f2f2'
  clear() {
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect(0, 0, this.element.width, this.element.height)
  }

  private readonly gridColor = '#b5b5b5'
  private readonly gridWidth = 1
  private readonly gridSize = 45
  private gridOffset = 0
  private readonly gridSpeed = 0.5
  drawGrid() {
    for (let col = this.gridOffset; col < this.element.width; col += this.gridSize) {
      this.drawLine([col, 0], [col, this.element.height], this.gridWidth, this.gridColor)
    }
    for (let row = this.gridOffset; row < this.element.height; row += this.gridSize) {
      this.drawLine([0, row], [this.element.width, row], this.gridWidth, this.gridColor)
    }
    this.gridOffset += this.gridSpeed
    this.gridOffset %= this.gridSize
  }

  private readonly edgeColor = '#053061'
  private readonly edgeWidth = 4
  drawEdge([start, end]: Edge) {
    this.drawLine(start, end, this.edgeWidth, this.edgeColor)
  }
}