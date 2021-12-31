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

      this.cursors = cursors
      //sprite.on('pointerdown', () => {
      //  sprite.setTexture(key2);
      //});

      scene.anims.create({
        key: "east",
        frameRate: 7,
        frames: scene.anims.generateFrameNumbers("player", { start: 28, end: 34 }),
        repeat: -1
      });
      this.play("east"); 
      
    }

    update(speed) {

        let new_speedX = 0
        let new_speedY = 0

        if (this.cursors.left.isDown)
          new_speedX -= 10
        else if (this.cursors.right.isDown)
            new_speedX = 10
        
        if (this.cursors.up.isDown)
            new_speedY -= 10
        else if (this.cursors.down.isDown)
            new_speedY = 10
        
        this.setVelocityX(new_speedX * 10);
        this.setVelocityY(new_speedY * 10);
    }

    destroy(){
        this.body.destroy()
    }
  }