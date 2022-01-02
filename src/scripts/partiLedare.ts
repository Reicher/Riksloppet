export default class PartiLedare extends Phaser.Physics.Arcade.Sprite {
      cursors      
    constructor(scene, x: number, y: number, key: string, cursors?) {
      super(scene, x, y, key);
      this.scene = scene;
      this.x = x;
      this.y = y;

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.setInteractive() // Fyll på med info
      this.setCollideWorldBounds()


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
            new_speedX -= 20
        else if (this.cursors.right.isDown)
            new_speedX = 20

        if (this.cursors.up.isDown)
            new_speedY -= 20
        else if (this.cursors.down.isDown)
            new_speedY = 20

        this.setVelocityX(new_speedX);
        this.setVelocityY(new_speedY);      
    }

    update(speed) {
        if (this.cursors)
            this.playerControl(speed)
        else{
            this.setVelocityX(15);
            this.setVelocityY(0);
        }
    }

    destroy(){
        this.body.destroy()
    }
  }