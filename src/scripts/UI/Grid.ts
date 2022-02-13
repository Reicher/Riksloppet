import { SPACING } from './constants'
import { Styles } from './types'
import { UIElement } from './UIElement'

type GridAxis = 'auto' | number

const defaultGridStyles: Styles = {
  display: 'grid',
  gap: SPACING.LARGE
}

export class Grid extends UIElement<HTMLDivElement> {
  rows: GridAxis
  columns: GridAxis
  maxChildren: number

  constructor(_rows: GridAxis, _columns: GridAxis) {
    super()
    this.rows = _rows
    this.columns = _columns
    this.maxChildren = Infinity

    this.initialize()
  }

  private initialize() {
    const divElement = document.createElement('div')
    this.element = divElement

    this.setStyle(defaultGridStyles)

    if (this.columns !== 'auto') {
      this.setStyle({
        gridTemplateColumns: `repeat(${this.columns}, 1fr)`
      })
    }
    if (this.rows !== 'auto') {
      this.setStyle({
        gridTemplateRows: `repeat(${this.rows}, 1fr)`
      })
    }

    if (typeof this.columns === 'number' && typeof this.rows === 'number') {
      this.maxChildren = this.columns * this.rows
    }
  }

  public addElement(...elements: UIElement[]): void {
    elements.forEach(element => {
      element.attatch(this.element)
    })

    if (this.element.childElementCount > this.maxChildren) {
      console.warn('UI Grid reached max amount of children, layout may be affected!')
    }
  }
}
