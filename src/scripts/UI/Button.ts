import { COLOR } from './constants'
import { Styles } from './types'
import { UIElement } from './UIElement'

const buttonNormalStyle = (color: COLOR): Styles => ({
  border: `5px solid ${color}`,
  backgroundColor: 'transparent',
  color
})

const buttonHoverStyle = (color: COLOR): Styles => ({
  backgroundColor: color,
  color: 'white'
})

const buttonDefaultStyle: Styles = {
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
    this.element = buttonElement

    this.setStyle(buttonDefaultStyle, buttonNormalStyle(color))

    buttonElement.addEventListener('mouseenter', () => this.setStyle(buttonHoverStyle(color)))
    buttonElement.addEventListener('mouseleave', () => this.setStyle(buttonNormalStyle(color)))
  }
}
