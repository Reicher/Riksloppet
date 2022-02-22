import { UIElement } from './UIElement'

interface ImageProps {
  width: number | string
  height: number | string
  source: string
  sizing: 'contain' | 'cover'
}

export class Image extends UIElement<HTMLImageElement> implements ImageProps {
  width: number | string
  height: number | string
  source: string
  sizing: 'contain' | 'cover'

  constructor({ width, height, source, sizing }: ImageProps) {
    super()

    this.width = width
    this.height = height
    this.source = source
    this.sizing = sizing

    this.initialize()
  }

  private initialize() {
    const imageElement = document.createElement('img')
    this.element = imageElement

    imageElement.src = this.source
    const width = typeof this.width === 'number' ? `${this.width}px` : this.width
    const height = typeof this.height === 'number' ? `${this.height}px` : this.height

    this.setStyle({
      width,
      height,
      objectFit: this.sizing
    })
  }
}
