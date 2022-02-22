import { getLedamotForParti, Parti } from '../scenes/constants'
import { Image } from './Image'
import { Styles } from './types'

const IMAGE_SIZE = '100%'
const defaultImageStyle: Styles = {
  filter: 'grayscale(100%)',
  cursor: 'pointer'
}

const imageHoverStyle: Styles = {
  filter: 'none'
}

const getPortättImageSource = (parti: Parti) => `assets/img/${getLedamotForParti(parti)}_porträtt.png`

export class PortättImage extends Image {
  parti: Parti
  isActive: boolean

  constructor(parti: Parti) {
    super({ width: IMAGE_SIZE, height: IMAGE_SIZE, sizing: 'contain', source: getPortättImageSource(parti) })

    this.parti = parti
    this.element.tabIndex = 0
    this.setStyle(defaultImageStyle, { transition: 'filter .25s ease' })
    this.setupListener()
  }

  private setupListener() {
    this.element.addEventListener('mouseenter', () => {
      this.setStyle(imageHoverStyle)
    })

    this.element.addEventListener('mouseleave', () => {
      if (!this.isActive) {
        this.setStyle(defaultImageStyle)
      }
    })
  }

  setActive(isActive: boolean) {
    this.isActive = isActive
    if (isActive) {
      this.setStyle(imageHoverStyle)
    } else {
      this.setStyle(defaultImageStyle)
    }
  }
}
