export default class SplashScene extends Phaser.Scene {
  fade_time = 1000
  constructor() {
    super({ key: 'SplashScene' })
  }

  preload() {}

  create() {
    console.log('Splash')
    this.add.sprite(0, 0, 'splash').setOrigin(0)

    this.cameras.main.once('camerafadeincomplete', function (camera) {
      camera.fadeOut(camera.scene.fade_time)
    })
    this.cameras.main.once('camerafadeoutcomplete', function (camera) {
      camera.scene.scene.start('TitleScene')
    })

    this.cameras.main.fadeIn(this.fade_time)
  }
}
