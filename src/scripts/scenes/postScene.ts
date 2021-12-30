import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'



export default class PostScene extends Phaser.Scene {
  cursors
  constructor() {
    super({ key: 'PostScene' })

  }

  create() {
    console.log('Game over')
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.sprite(0, 0, 'postGame').setOrigin(0)
  }

  update() {
    if (this.cursors.space.isDown)
    {
      this.scene.start('TitleScene')
    }
  }
}
