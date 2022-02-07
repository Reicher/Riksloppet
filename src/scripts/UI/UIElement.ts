import { absolutePositionAt } from './constants'
import { EventHandler, UIPosition } from './types'

export class UIElement<TElement extends HTMLElement = HTMLElement> {
  protected element: TElement
  constructor() {}

  public setPosition(position: Partial<UIPosition>) {
    Object.assign(
      this.element.style,
      absolutePositionAt({ x: 0, y: 0, fromCenter: false, relative: false, ...position })
    )
  }

  public attatch(parent = document.documentElement) {
    parent.appendChild(this.element)
  }

  public destroy() {
    this.element.remove()
  }

  public onClick(handler: EventHandler<'click'>) {
    this.element.addEventListener('click', handler)
  }
}
