import PartiLedare from '../partiLedare'

export default class MainScene extends Phaser.Scene {
  player

  kill_line
  cursors

  WIDTH
  HEIGHT

  constructor() {
    super({ key: 'MainScene' })

  }

  init(data) {    
    this.WIDTH = this.sys.game.canvas.width;
    this.HEIGHT = this.sys.game.canvas.height;
    this.kill_line = 0
    this.physics.world.setBounds(-50, 200, this.WIDTH*2, this.HEIGHT-200)

    this.add.tileSprite(0, 0, this.WIDTH*2, 200, "bakgrund3").setOrigin(0).setScrollFactor(0.4)
    this.add.tileSprite(0, 0, this.WIDTH*2, 200, "bakgrund2").setOrigin(0).setScrollFactor(0.7)
    this.add.tileSprite(0, 0, this.WIDTH*2, 200, "bakgrund1").setOrigin(0).setScrollFactor(0.9)
    this.add.tileSprite(0, 0, this.WIDTH*2, this.HEIGHT, "mark").setOrigin(0)
    


  }

  create() {
    console.log('Main Scene')

    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.player = new PartiLedare(this, 50, 300, 'player', this.cursors)
    this.anims.create({
      key: "east",
      frameRate: 7,
      frames: this.anims.generateFrameNumbers("player", { start: 28, end: 34 }),
      repeat: -1
    });
    //this.player = this.physics.add.sprite(50, this.WIDTH/4, "player");
    //this.player
    //this.player.play("east"); 

    this.cameras.main.setBounds(0, 0,  this.WIDTH*5, this.HEIGHT);

    for(let i = 0; i < 3; i++)
      this.add.sprite(Phaser.Math.Between(this.WIDTH/2, this.WIDTH*2), Phaser.Math.Between(0, this.HEIGHT), 'peng')

  }

  update() {
    this.player.update()
    
    // Game speed and state stuff
    if (this.player.x < this.kill_line){
      this.scene.start('PostScene')
    }
    //else if (this.player.x >= this.kill_line + this.WIDTH/2 && this.cursors.right.isDown)
    //  this.kill_line = this.player.x - this.WIDTH/2
    else 
      this.kill_line += 0.2

    this.cameras.main.setScroll(this.kill_line, 0)
  }
}
