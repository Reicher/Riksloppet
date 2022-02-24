import { Physics, Scene } from 'phaser'
import Partiledare from './PartiLedare'

export default class Statist extends Phaser.Physics.Arcade.Sprite {
  powerup: Physics.Arcade.Sprite // Kan va null
  powerup_tween
  constructor(scene: Scene, x: number, y: number, key: string, powerup: Physics.Arcade.Sprite | null) {
    super(scene, x, y, key)
    scene.anims.create({
      key: 'smält',
      frameRate: 20,
      frames: this.anims.generateFrameNumbers('statist', { start: 0, end: 8 }),
      repeat: 0
    })

    scene.anims.create({
      key: 'kasta',
      frameRate: 15,
      frames: this.anims.generateFrameNumbers('åskådare_kille_kast', { start: 0, end: 4 }),
      repeat: 0
    })

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setBodySize(30, 30)
    this.body.setOffset(10, 50)
    this.depth = this.y

    if (powerup) {
      this.powerup = powerup

      let goal = 0
      if (y < 400) {
        goal = Phaser.Math.Between(this.y + 50, 500) // kanske måste finetuna
      } else {
        goal = Phaser.Math.Between(200, this.y - 50) // kanske måste finetuna
      }

      this.powerup.depth = this.y
      scene.physics.add.existing(this)
      this.setFrame(4)

      this.powerup_tween = this.scene.tweens.add({
        targets: this.powerup,
        y: { from: this.powerup.y, to: goal },
        ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 1000,
        paused: true
      })

      scene.time.addEvent({
        delay: Phaser.Math.Between(500, 5600), // ms
        callback: this.kasta,
        callbackScope: this
      })
    }
  }

  kasta() {
    if (this.powerup) {
      this.play('kasta', true)
      this.powerup_tween.play()
    }
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

  update(...args: any[]): void {
    this.powerup.depth = this.powerup.y
  }
}
