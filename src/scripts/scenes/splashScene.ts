export default class SplashScene extends Phaser.Scene {
  fade_time = 1000
  cursors
  constructor() {
    super({ key: 'SplashScene' })
  }


  create() {
    console.log('Splash')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.add.sprite(960/2, 540/2, 'logo').setScale(2)

    this.cameras.main.once('camerafadeincomplete', function (camera) {
      camera.fadeOut(camera.scene.fade_time)
    })
    this.cameras.main.once('camerafadeoutcomplete', function (camera) {
      camera.scene.scene.start('TitleScene')
    })

    this.input.on('pointerdown', () => { this.scene.start('TitleScene') }, this);
    this.input.keyboard.addKey('space').on('down', () => { this.scene.start('TitleScene') }, this);

    this.cameras.main.fadeIn(this.fade_time)    
  }
}
