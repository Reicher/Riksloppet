import 'phaser'
import PostScene from './scenes/postScene'
import TitleScene from './scenes/titleScene'
import PreloadScene from './scenes/preloadScene'
import SplashScene from './scenes/splashScene'
import LevelSelectScene from './scenes/LevelSelectScene'
import CharSelectScene from './scenes/CharSelectScene'
import { SinglePlayerScene } from './scenes/SinglePlayerScene'
import { MultiplayerScene } from './scenes/MultiplayerScene'
import { GameTypeSelectScene } from './scenes/GameTypeSelectScene'
import { LobbyScene } from './scenes/LobbyScene'

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
  scene: [
    PreloadScene,
    SplashScene,
    GameTypeSelectScene,
    LobbyScene,
    TitleScene,
    LevelSelectScene,
    CharSelectScene,
    PostScene,
    SinglePlayerScene,
    MultiplayerScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
