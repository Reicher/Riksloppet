import { UIElement } from './UIElement'

export class UIHandler {
  private static elements: UIElement[] = []
  constructor() {}

  static addElement(...elements: UIElement[]) {
    elements.forEach(element => {
      this.elements.push(element)
      element.attatch()
    })
  }

  static clear() {
    this.elements.forEach(element => element.destroy())
  }
}
