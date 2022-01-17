import 'phaser'
import MainScene from './scenes/mainScene'
import PostScene from './scenes/postScene'
import TitleScene from './scenes/titleScene'
import PreloadScene from './scenes/preloadScene'
import SplashScene from './scenes/splashScene'
import LevelSelectScene from './scenes/levelSelectScene'
import CharSelectScene from './scenes/charSelectScene'

const DEFAULT_WIDTH = 960
const DEFAULT_HEIGHT = 540

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
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
  scene: [PreloadScene, SplashScene, TitleScene, LevelSelectScene, CharSelectScene, MainScene, PostScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
