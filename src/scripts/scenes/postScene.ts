import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'



export default class PostScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PostScene' })

  }

  create() {
    console.log('Game over')
    this.scene.start('MainScene',  {"message": "Game Over" } )
  }

  update() {
  }
}
