export default class PartiLedare extends Phaser.Physics.Arcade.Sprite {
      cursors      
      speed = 50
    constructor(scene, x: number, y: number, key: string, cursors?) {
      super(scene, x, y, key);
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.cursors = cursors

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.setInteractive() // Fyll på med info
      this.setCollideWorldBounds()

        // Change to key later....
      scene.anims.create({
        key: "east",
        frameRate: 7,
        frames: scene.anims.generateFrameNumbers("player", { start: 28, end: 34 }),
        repeat: -1
      });
      this.play("east"); 
      
    }

    playerControl (speed){

        let new_speedX = 0
        let new_speedY = 0

        if (this.cursors.left.isDown)
            new_speedX -= this.speed
        else if (this.cursors.right.isDown)
            new_speedX = this.speed

        if (this.cursors.up.isDown)
            new_speedY -= this.speed
        else if (this.cursors.down.isDown)
            new_speedY = this.speed

        this.setVelocityX(new_speedX);
        this.setVelocityY(new_speedY);      
    }

    update(speed) {
        if (this.cursors)
            this.playerControl(speed)
        else{
            this.setVelocityX(this.speed*0.5);
            this.setVelocityY(0);
        }
    }

    destroy(){
        this.body.destroy()
    }
  }