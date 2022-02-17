import Partiledare from './partiLedare'

export default class Statist extends Phaser.Physics.Arcade.Sprite {
  powerup: any // Kan va null
  constructor(scene, x: number, y: number, key: string, powerups: any) {
    super(scene, x, y, key)

    scene.anims.create({
      key: 'smält',
      frameRate: 20,
      frames: this.anims.generateFrameNumbers('statist', { start: 0, end: 8 }),
      repeat: 0
    })

    scene.anims.create({
      key: 'kasta',
      frameRate: 8,
      frames: this.anims.generateFrameNumbers('åskådare_kille_kast', { start: 0, end: 4 }),
      repeat: 0
    })

    scene.add.existing(this)
    scene.physics.add.existing(this)

    var timer = scene.time.addEvent({
      delay: Phaser.Math.RND.integerInRange(3000, 20000),
      callback: this.kasta,
      callbackScope: this
    })

    this.setBodySize(30, 30)
    this.body.setOffset(10, 50)
    this.depth = this.y

    let pwup: any
    if (Phaser.Math.RND.integerInRange(0, 100) > 70)
      // Top 30 % is updut
      pwup = powerups.create(0, 0, 'peng')
    else if (Phaser.Math.RND.integerInRange(0, 100) > 50)
      // Top 50-70 % is downdut
      pwup = powerups.create(0, 0, 'neddut')
    else pwup = null

    if (pwup) {
      this.powerup = pwup
      this.powerup.setPosition(x, y - this.body.height - 20)
      this.powerup.depth = this.y
      this.powerup.setOrigin(0, 0.5)
    }
  }

  kasta() {
    this.play('kasta', true)
    console.log('KAST!')
  }

  collidedWith(ledare: Partiledare) {
    ledare.knockOut()
    this.destroy()
  }

  destroy() {
    if (this.powerup) this.powerup.destroy(true)

    this.play('smält', true)
    this.once('animationcomplete', () => {
      super.destroy()
    })
  }
}
