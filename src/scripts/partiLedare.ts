export default class PartiLedare extends Phaser.Physics.Arcade.Sprite {
  cursors
  max_speed = 8
  rest_speed = 8
  knocked_out = 0
  punch = false
  player = false
  aiAction = 0
  aiDir = [0, 0]
  dir = [0, 0]
  key = 'Politisk Vilde'

  constructor(scene, x: number, y: number, key: string, cursors?) {
    super(scene, x, y, 'c_stopp')
    this.key = key
    if (cursors) {
      this.cursors = cursors
      this.setInteractive()
      this.player = true
    }

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

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setBodySize(30, 30)
    this.body.setOffset(10, 50)
  }

  getSpeedFromDir(x, y) {
    let mag = Math.abs(Math.sqrt(x * x + y * y))
    if (mag == 0) mag = 1

    return [(x / mag) * this.max_speed, (y / mag) * this.max_speed]
  }

  playerControl(time, delta) {
    if (this.cursors.left.isDown) this.dir[0] = -1
    else if (this.cursors.right.isDown) this.dir[0] = 1

    if (this.cursors.up.isDown) this.dir[1] = -1
    else if (this.cursors.down.isDown) this.dir[1] = 1

    if (this.cursors.space.isDown) {
      this.punch = true
      this.anims.play('slag')
    } else this.punch = false

    console.log(this.anims.isPlaying)
  }

  aiControl(time, delta) {
    // Time to take action!
    if (this.aiAction <= 0) {
      this.aiDir = [1, Phaser.Math.Between(-100, 100) / 100]
      this.aiAction = Phaser.Math.Between(0.3, 1)
    }
    this.dir = this.aiDir
  }

  update(time, delta) {
    this.dir = [0, 0]
    // Check if new action
    if (this.knocked_out > 0) this.knocked_out -= delta / 1000
    else if (this.player) this.playerControl(time, delta)
    else {
      if (this.aiAction > 0) this.aiAction -= delta / 1000

      this.aiControl(time, delta)
    }

    // hastigheten vill till rest_speed
    if (this.max_speed > this.rest_speed) this.max_speed -= delta / 1000
    else if (this.max_speed < this.rest_speed) this.max_speed += delta / 1000

    let speed = this.getSpeedFromDir(this.dir[0], this.dir[1])
    let a = this.anims.animationManager.get('spring')
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
