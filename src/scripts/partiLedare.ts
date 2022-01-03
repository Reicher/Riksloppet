export default class PartiLedare extends Phaser.Physics.Arcade.Sprite {
      cursors      
      speed = [0, 0]
      max_speed = 5
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

    playerControl (){
        if (this.cursors.left.isDown)
            this.speed[0] = -this.max_speed
        else if (this.cursors.right.isDown)
            this.speed[0] = this.max_speed
        else
            this.speed[0] = 0

        if (this.cursors.up.isDown)
            this.speed[1] = -this.max_speed
        else if (this.cursors.down.isDown)
            this.speed[1] = this.max_speed
        else
            this.speed[1] = 0
    }

    update() {
        if (this.cursors)
            this.playerControl()
        else
            this.speed[0] = this.max_speed 
    }

    destroy(){
        this.body.destroy()
    }
  }