export default class PartiLedare extends Phaser.Physics.Arcade.Sprite {
    cursors      
    max_speed = 10
    knocked_out = 0
    punch = false
    player = false

    constructor(scene, x: number, y: number, key: string, cursors?) {
      super(scene, x, y, key);
      if (cursors){
        this.cursors = cursors
        this.setInteractive()
        this.player = true
      }
      scene.add.existing(this);      
      scene.physics.add.existing(this)

      // For now
      scene.anims.create({
        key: "east",
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers("annie_run", { start: 0, end: 11 }),
        repeat: -1
      });
      this.play("east"); 
      
    }

    playerControl (){
        console.log('topspeed: ' + this.max_speed)
        let dir = [0, 0]
        if (this.cursors.left.isDown)
            dir[0] = -1
        else if (this.cursors.right.isDown)
            dir[0] = 1

        if (this.cursors.up.isDown)
            dir[1] = -1
        else if (this.cursors.down.isDown)
            dir[1] = 1

        let mag = Math.abs(Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1]))
        if (mag == 0)
            mag = 1

        if (this.cursors.space.isDown){
            this.punch = true
        }else
            this.punch = false

        // Return speed
        return [dir[0]/mag * this.max_speed, dir[1]/mag * this.max_speed]
    }

    update(time, delta) {
        let speed = [0, 0]

        if (this.knocked_out > 0)
        {
            speed[0] = 0
            this.knocked_out -= (delta/1000)
        }
        else if (this.player)
            speed = this.playerControl()
        else
        {
            speed[0] = this.max_speed // Super AI
            speed[1] = 0
        }
        this.setVelocityX(speed[0] * delta)
        this.setVelocityY(speed[1] * delta)

        this.depth = this.y
    }
  }