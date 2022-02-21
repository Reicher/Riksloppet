import { absolutePositionAt } from './constants'
import { EventHandler, Styles, UIPosition } from './types'

export class UIElement<TElement extends HTMLElement = HTMLElement> {
  protected element: TElement

  private parent: HTMLElement

  constructor() {}

  public setPosition(position: Partial<UIPosition>) {
    this.setStyle(absolutePositionAt({ x: 0, y: 0, fromCenter: false, relative: false, ...position }))
  }

  public attatch(parent = document.documentElement) {
    this.parent = parent
    parent.appendChild(this.element)
  }

  public destroy() {
    this.element.remove()
  }

  public onClick(handler: EventHandler<'click'>) {
    this.element.addEventListener('click', handler)
  }

  public show() {
    this.setStyle({
      opacity: '1',
      pointerEvents: 'auto',
      touchAction: 'auto'
    })
  }

  public hide() {
    this.setStyle({
      opacity: '0',
      pointerEvents: 'none',
      touchAction: 'none'
    })
  }

  protected setStyle(...styles: Styles[]) {
    Object.assign(this.element.style, ...styles)
  }
}
