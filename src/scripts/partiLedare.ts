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

      
    }

    update() {
        if (this.cursors.left.isDown)
        {
          this.setVelocityX(-75);
        }
        else if (this.cursors.right.isDown)
        {
          this.setVelocityX(75);   
        }
        else
          this.setVelocityX(0);
    
        if (this.cursors.up.isDown)
        {
          this.setVelocityY(-75);    
        }
        else if (this.cursors.down.isDown)
        {
          this.setVelocityY(75);    
        }
        else
          this.setVelocityY(0);
    }

    destroy(){
        this.body.destroy()
    }
  }