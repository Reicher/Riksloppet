export default class PartiLedare extends Phaser.Physics.Arcade.Sprite {
    cursors      
    max_speed = 8
    knocked_out = 0
    punch = false
    player = false
    aiAction = 0
    aiDir = [0, 0]
    dir =[0, 0]

    constructor(scene, x: number, y: number, key: string, cursors?) {
      super(scene, x, y, key);
      if (cursors){
        this.cursors = cursors
        this.setInteractive()
        this.player = true
      }
      scene.add.existing(this);      
      scene.physics.add.existing(this)

      this.body.setOffset(0, 50)

      // For now
      scene.anims.create({
        key: "east",
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers("annie_run", { start: 0, end: 11 }),
        repeat: -1
      });
      this.play("east"); 
    }

    getSpeedFromDir(x, y){
        let mag = Math.abs(Math.sqrt(x*x + y*y))
        if (mag == 0)
            mag = 1

        return [x/mag * this.max_speed, y/mag * this.max_speed]
    }

    playerControl (time, delta){
        if (this.cursors.left.isDown)
            this.dir[0] = -1
        else if (this.cursors.right.isDown)
            this.dir[0] = 1

        if (this.cursors.up.isDown)
            this.dir[1] = -1
        else if (this.cursors.down.isDown)
            this.dir[1] = 1

        if (this.cursors.space.isDown){
            this.punch = true
        }else
            this.punch = false
    }

    aiControl(time, delta) {
        // Time to take action!
        if (this.aiAction <= 0)        
        {
            this.aiDir = [1, Phaser.Math.Between(-100, 100)/100]
            this.aiAction = Phaser.Math.Between(0.3, 1)
        }
        this.dir = this.aiDir
    }

    update(time, delta) {
        this.dir = [0, 0]
        // Check if new action
        if (this.knocked_out > 0)
            this.knocked_out -= (delta/1000)
        else if (this.player)
            this.playerControl(time, delta)
        else{ 
            if (this.aiAction > 0)
                this.aiAction -= (delta/1000)

            this.aiControl(time, delta)
        }

        let speed = this.getSpeedFromDir(this.dir[0], this.dir[1])
        this.setVelocityX(speed[0] * delta)
        this.setVelocityY(speed[1] * delta)

        this.depth = this.y
    }
  }