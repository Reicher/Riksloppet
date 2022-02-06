export default class TitleScene extends Phaser.Scene {
  cursors
  isClicking = false;
  swipeDirection;

  constructor() {
    super({ key: 'TitleScene' })

  }
  create() {
    console.log('PreGame')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.add.sprite(0, 0, 'title').setOrigin(0)

    this.input.on('pointerdown', () => { this.scene.start('CharSelectScene') }, this);
    this.input.keyboard.addKey('space').on('down', () => { this.scene.start('CharSelectScene') }, this);
  }
}
