import 'phaser'
import MainScene from './scenes/mainScene'
import PostScene from './scenes/postScene'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 960
const DEFAULT_HEIGHT = 540

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ff23ff',
  pixelArt: true,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,

  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene, PostScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
