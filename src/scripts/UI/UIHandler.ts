import { UIElement } from './UIElement'

export class UIHandler {
  private static screenIndex: number = 0
  private static screens: UIElement[][] = [[]]

  constructor() {}

  static addElement(...elements: UIElement[]) {
    elements.forEach(element => {
      this.screens[this.screenIndex].push(element)
      element.attatch()
    })
  }

  /**
   * Adds a UI screen on top of the stack
   */
  static addScreen() {
    this.hideScreen()

    this.screens.push([...this.screens[this.screenIndex]])
    this.screenIndex++
    this.screens.push([])
  }

  /**
   * Hide the current screen elements
   */
  static hideScreen() {
    this.screens[this.screenIndex].forEach(element => element.hide())
  }

  /**
   * Show the current screen elements
   */
  static showScreen() {
    this.screens[this.screenIndex].forEach(element => element.show())
  }

  /**
   * Clears the current active screen
   */
  static clearScreen() {
    this.screens[this.screenIndex].forEach(element => element.destroy())
  }

  /**
   * Removes the current screen from the stack
   */
  static removeScreen() {
    const elements = this.screens.pop()
    if (elements) {
      elements.forEach(element => element.destroy())
    }
    this.screenIndex--
    if (this.screenIndex < 0) {
      this.screenIndex = 0
      this.screens.push([])
    }

    this.showScreen()
  }
}
