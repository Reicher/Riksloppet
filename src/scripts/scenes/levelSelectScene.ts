import { UIHandler } from '../UI/UIHandler'

export default class LevelSelectScene extends Phaser.Scene {
  cursors
  constructor() {
    super({ key: 'LevelSelectScene' })
  }
  create() {
    UIHandler.clear()
    console.log('LevelSelectScene')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.add.sprite(0, 0, 'levelSetting').setOrigin(0)

    this.input.on(
      'pointerdown',
      () => {
        this.scene.start('CharSelectScene')
      },
      this
    )
    this.input.keyboard.addKey('space').on(
      'down',
      () => {
        this.scene.start('CharSelectScene')
      },
      this
    )
  }
}
