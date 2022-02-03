export default class PostScene extends Phaser.Scene {
  cursors
  constructor() {
    super({ key: 'PostScene' })
  }

  create() {
    console.log('Game over')
    this.add.sprite(0, 0, 'postGame').setOrigin(0)
    this.input.on('pointerdown', () => { this.scene.start('TitleScene') }, this);
    this.input.keyboard.addKey('space').on('down', () => { this.scene.start('TitleScene') }, this);
  }
}
