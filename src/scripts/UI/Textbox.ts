import { COLOR } from './constants'
import { UIElement } from './UIElement'

const textInputNormalStyle = (color: COLOR) => ({
  border: `5px solid ${color}`,
  backgroundColor: 'transparent',
  color
})

const textInputFocusStyle = (color: COLOR) => ({
  backgroundColor: color,
  color: 'white'
})

const textInputDefaultStyle = {
  borderRadius: '10px',
  margin: '0px',
  padding: '20px 30px',
  fontSize: '64px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all .25s ease'
}

export class Textbox extends UIElement<HTMLInputElement> {
  constructor(placeholder: string, color: COLOR) {
    super()
    this.initialize(placeholder, color)
  }

  private initialize(placeholder: string, color: COLOR) {
    const inputElement = document.createElement('input')
    inputElement.placeholder = placeholder

    Object.assign(inputElement.style, textInputDefaultStyle, textInputNormalStyle(color))

    inputElement.addEventListener('focusin', () => Object.assign(inputElement.style, textInputFocusStyle(color)))
    inputElement.addEventListener('focusout', () => Object.assign(inputElement.style, textInputNormalStyle(color)))

    this.element = inputElement
  }

  public getValue() {
    return this.element.value.trim()
  }
}
