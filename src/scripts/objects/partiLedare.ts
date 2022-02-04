import { Dir } from '../../../typings/custom'
import { PARTI_LEDAMOT } from '../scenes/constants'

export default class Partiledare extends Phaser.Physics.Arcade.Sprite {
  max_speed = 8
  rest_speed = 8
  knocked_out = 0
  slår = false
  key: PARTI_LEDAMOT

  constructor(scene, x: number, y: number, key: PARTI_LEDAMOT) {
    super(scene, x, y, 'c_stopp')
    this.setInteractive()
    this.key = key

    // Running animation
    scene.anims.create({
      key: 'spring',
      frameRate: 20,
      frames: scene.anims.generateFrameNumbers('c_run', { start: 0, end: 11 }),
      repeat: -1
    })

    // stopping animation
    scene.anims.create({
      key: 'stopp',
      frameRate: 40,
      frames: scene.anims.generateFrameNumbers('c_stopp', { start: 0, end: 5 }),
      repeat: 0
    })

    // punching animation
    scene.anims.create({
      key: 'slag',
      frameRate: 30,
      frames: scene.anims.generateFrameNumbers('c_slag', { start: 0, end: 5 }),
      repeat: 0
    })

    scene.physics.add.existing(this)

    this.setBodySize(30, 30)
    this.body.setOffset(10, 50)

    scene.add.existing(this)
  }

  slå() {
    if (!this.slår) {
      this.slår = true
      this.anims.play('slag')
      var timer = this.scene.time.addEvent({
        delay: 500, // ms
        callback: () => {
          this.slår = false
        },
        callbackScope: this,
        loop: false
      })
    }
  }

  knockOut() {
    this.knocked_out = 1
  }

  getSpeedFromDir(x, y) {
    let mag = Math.abs(Math.sqrt(x * x + y * y))
    if (mag == 0) mag = 1

    return [(x / mag) * this.max_speed, (y / mag) * this.max_speed]
  }

  update(time, delta, dir: Dir) {
    if (this.knocked_out > 0) {
      this.knocked_out -= delta / 1000
      dir = [0, 0]
    }
    // hastigheten vill till rest_speed
    if (this.max_speed > this.rest_speed) this.max_speed -= delta / 1000
    else if (this.max_speed < this.rest_speed) this.max_speed += delta / 1000

    let speed = this.getSpeedFromDir(dir[0], dir[1])
    if (speed[0] != 0 || speed[1] != 0) this.anims.play('spring', true)
    else if (this.anims.currentAnim && this.anims.currentAnim.key != 'stopp') this.anims.play('stopp', true)

    // Flipa bild när man springer vänster
    if (speed[0] >= 0) this.setFlipX(false)
    else this.setFlipX(true)

    // Sätt fart
    this.setVelocityX(speed[0] * delta)
    this.setVelocityY(speed[1] * delta)

    this.depth = this.y
  }
}
