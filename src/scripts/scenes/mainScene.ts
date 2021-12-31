import PartiLedare from '../partiLedare'

export default class MainScene extends Phaser.Scene {
  player : PartiLedare

  bg3
  bg2
  bg1
  mark

  minimum_speed = 0.5
  speed = 0
  kill_line = 0
  cursors

  WIDTH : number
  HEIGHT : number

  constructor() {
    super({ key: 'MainScene' })

  }

  init() {    
    this.WIDTH = this.sys.game.canvas.width;
    this.HEIGHT = this.sys.game.canvas.height;

    this.physics.world.setBounds(-50, 200, this.WIDTH + 50, this.HEIGHT)

    this.bg3 = this.add.tileSprite(0, 0, this.WIDTH, 200, "bakgrund3").setOrigin(0).setScrollFactor(0.4)
    this.bg2 = this.add.tileSprite(0, 0, this.WIDTH, 200, "bakgrund2").setOrigin(0).setScrollFactor(0.7)
    this.bg1 = this.add.tileSprite(0, 0, this.WIDTH, 200, "bakgrund1").setOrigin(0).setScrollFactor(0.9)
    this.mark = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, "mark").setOrigin(0)
  }

  create() {
    console.log('Main Scene')

  
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.player = new PartiLedare(this, 50, 300, 'player', this.cursors)


    for(let i = 0; i < 3; i++)
      this.add.sprite(Phaser.Math.Between(this.WIDTH/2, this.WIDTH*2), Phaser.Math.Between(0, this.HEIGHT), 'peng')

  }

  update() {
    this.speed = this.minimum_speed



    this.player.update(this.speed)
    
    // Game speed and state stuff
    if (this.player.x < this.kill_line){
      this.scene.start('PostScene')
    }
    //else if (this.player.x >= this.kill_line + this.WIDTH/2 && this.cursors.right.isDown)
    //  this.kill_line = this.player.x - this.WIDTH/2


      // update drawn background
      this.mark.tilePositionX += this.speed
      this.bg1.tilePositionX += this.speed * 0.75
      this.bg2.tilePositionX += this.speed * 0.5
      this.bg3.tilePositionX += this.speed * 0.25
  }
}
