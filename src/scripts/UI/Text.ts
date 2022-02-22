import { UIElement } from './UIElement'

type TextLevel = 'normal' | 'heading'

const textDefaultStyle = (level: TextLevel) => ({
  color: 'white',
  fontSize: level === 'heading' ? '98px' : '49px',
  fontWeight: level === 'heading' ? 'bold' : 'normal',
  fontFamily: 'Monospace',
  margin: '0px',
  lineHeight: '1'
})

export class Text extends UIElement<HTMLParagraphElement | HTMLHeadingElement> {
  constructor(text: string, level: TextLevel) {
    super()
    this.initialize(text, level)
  }

  private initialize(text: string, level: TextLevel) {
    const textElement = document.createElement(level === 'heading' ? 'h1' : 'p')
    textElement.innerText = text

    Object.assign(textElement.style, textDefaultStyle(level))

    this.element = textElement
  }

  public setText(text: string) {
    this.element.innerText = text
  }
}
