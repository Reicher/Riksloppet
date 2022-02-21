import { Button } from '../UI/Button'
import { COLOR } from '../UI/constants'
import { UIHandler } from '../UI/UIHandler'

export class GameTypeSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameTypeSelectScene' })
  }

  create() {
    console.log('GameTypeSelectScene')
    const singlePlayerButton = new Button('Single player', COLOR.LIGHT_BLUE)
    singlePlayerButton.setPosition({
      y: 100,
      fromCenter: true
    })
    singlePlayerButton.onClick(() => {
      this.scene.start('LevelSelectScene')
    })

    const multiplayerButton = new Button('Multiplayer', COLOR.GREEN)
    multiplayerButton.setPosition({
      y: -100,
      fromCenter: true
    })
    multiplayerButton.onClick(() => {
      this.scene.start('ServerConnectionScene')
    })

    UIHandler.addElement(singlePlayerButton, multiplayerButton)
  }
}
