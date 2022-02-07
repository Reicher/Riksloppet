import { COLOR } from './constants'
import { UIElement } from './UIElement'

const buttonNormalStyle = (color: COLOR) => ({
  border: `5px solid ${color}`,
  backgroundColor: 'transparent',
  color
})

const buttonHoverStyle = (color: COLOR) => ({
  backgroundColor: color,
  color: 'white'
})

const buttonDefaultStyle = {
  borderRadius: '10px',
  margin: '0px',
  padding: '20px 30px',
  fontSize: '64px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all .25s ease'
}

export class Button extends UIElement<HTMLButtonElement> {
  constructor(text: string, color: COLOR) {
    super()
    this.initialize(text, color)
  }

  private initialize(text: string, color: COLOR) {
    const buttonElement = document.createElement('button')
    buttonElement.innerText = text

    Object.assign(buttonElement.style, buttonDefaultStyle, buttonNormalStyle(color))

    buttonElement.addEventListener('mouseenter', () => Object.assign(buttonElement.style, buttonHoverStyle(color)))
    buttonElement.addEventListener('mouseleave', () => Object.assign(buttonElement.style, buttonNormalStyle(color)))

    this.element = buttonElement
  }
}
