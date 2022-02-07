import { UIElement } from './UIElement'

type TextLevel = 'normal' | 'heading'

export class Text extends UIElement<HTMLParagraphElement | HTMLHeadingElement> {
  constructor(text: string, level: TextLevel) {
    super()
    this.initialize(text, level)
  }

  private initialize(text: string, level: TextLevel) {
    const textElement = document.createElement(level === 'heading' ? 'h1' : 'p')
    textElement.innerText = text

    this.element = textElement
  }

  public setText(text: string) {
    this.element.innerText = text
  }
}
