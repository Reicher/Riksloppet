import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'



export default class MainScene extends Phaser.Scene {
  mark
  bakgrund1
  bakgrund2
  bakgrund3
  player

  cursors
  kill_line

  WIDTH = 960
  HEIGHT = 540

  constructor() {
    super({ key: 'MainScene' })

  }

  init(data) {
    this.kill_line = 0
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.setBounds(-50, 200, this.WIDTH/1.5, this.HEIGHT-200)

    this.bakgrund3 = this.add.tileSprite(0, 0, this.WIDTH, 200, "bakgrund3").setOrigin(0)
    this.bakgrund2 = this.add.tileSprite(0, 0, this.WIDTH, 200, "bakgrund2").setOrigin(0)
    this.bakgrund1 = this.add.tileSprite(0, 0, this.WIDTH, 200, "bakgrund1").setOrigin(0)
    this.mark = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, "mark").setOrigin(0)//.setScrollFactor(0.3, 0)
    
    this.anims.create({
      key: "east",
      frameRate: 7,
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 10 }),
      repeat: -1
    });
    this.player = this.physics.add.sprite(50, this.WIDTH/4, "player");
    this.player.body.collideWorldBounds=true;
    this.player.play("east"); 

    this.cameras.main.setBounds(0, 0,  this.WIDTH*5, this.HEIGHT);

  }

  create() {

  }

  update() {
    // setScrollFactor
    //this.forest.setScrollFactor(0.9)
		//this.hills.setScrollFactor(0.6)
		//this.mountains.setScrollFactor(0.3)

    if (this.player.x < this.cameras.main.scrollX){
      this.scene.start('PostScene')
    }

    this.cameras.main.setScroll(this.kill_line, 0)
    this.kill_line += 0.2

    if (this.cursors.left.isDown)
    {
      this.player.setVelocityX(-75);
    }
    else if (this.cursors.right.isDown)
    {
      this.player.setVelocityX(75);   
    }
    else
      this.player.setVelocityX(0);

    if (this.cursors.up.isDown)
    {
      this.player.setVelocityY(-75);    
    }
    else if (this.cursors.down.isDown)
    {
      this.player.setVelocityY(75);    
    }
    else
      this.player.setVelocityY(0);
  }
}
