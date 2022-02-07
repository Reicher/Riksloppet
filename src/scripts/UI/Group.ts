import { SPACING } from './constants'
import { UIElement } from './UIElement'

const groupDefaultStyle = (row: boolean) => ({
  display: 'flex',
  flexDirection: row ? 'row' : 'column',
  rowGap: SPACING.LARGE,
  columnGap: SPACING.LARGE
})

export class Group extends UIElement<HTMLDivElement> {
  constructor(row: boolean = false) {
    super()
    this.initialize(row)
  }

  private initialize(row: boolean) {
    const divElement = document.createElement('div')

    Object.assign(divElement.style, groupDefaultStyle(row))
    this.element = divElement
  }

  public addElement(...elements: UIElement[]): void {
    elements.forEach(element => {
      element.attatch(this.element)
    })
  }
}
