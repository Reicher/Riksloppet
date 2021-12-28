import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'



export default class MainScene extends Phaser.Scene {
  sky
  mountains
  hills
  forest
  player

  cursors
  run_length = 0

  WIDTH = 320
  HEIGHT = 200

  constructor() {
    super({ key: 'MainScene' })

  }

  create() {
    //new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.setBounds(0, 0, this.WIDTH, this.HEIGHT)

    //this.sky = this.physics.add.sprite(0, 0, 'sky');
    this.sky = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, "sky").setOrigin(0).setScrollFactor(0.3, 0)
    this.mountains = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, "mountains").setOrigin(0).setScrollFactor(0.4, 0);
    this.hills = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, "hills").setOrigin(0).setScrollFactor(0.6, 0);
    this.forest = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, "forest").setOrigin(0).setScrollFactor(0.9, 0);

    this.anims.create({
      key: "east",
      frameRate: 7,
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 10 }),
      repeat: -1
    });
    this.player = this.physics.add.sprite(0, 0, "player");
    this.player.play("east"); 

    this.cameras.main.setBounds(0, 0,  this.WIDTH, this.HEIGHT);
    this.cameras.main.startFollow(this.player);

  }

  update() {
    // setScrollFactor
    //this.forest.setScrollFactor(0.9)
		//this.hills.setScrollFactor(0.6)
		//this.mountains.setScrollFactor(0.3)

    this.run_length = this.player.x
		

    this.sky.setTilePosition(this.run_length * 0.1)
    this.mountains.setTilePosition(this.run_length * 0.2)
    this.hills.setTilePosition(this.run_length * 0.3)
    this.forest.setTilePosition(this.run_length * 0.4)

    if (this.cursors.left.isDown)
    {
      this.player.setVelocityX(-50);
    }
    else if (this.cursors.right.isDown)
    {
      this.player.setVelocityX(50);   
    }
    else
      this.player.setVelocityX(0);

    if (this.cursors.up.isDown)
    {
      this.player.setVelocityY(-50);    
    }
    else if (this.cursors.down.isDown)
    {
      this.player.setVelocityY(50);    
    }
    else
      this.player.setVelocityY(0);
  }
}
