import PartiLedare from '../partiLedare'

export default class MainScene extends Phaser.Scene {
  makten:PartiLedare[] = new Array(0)  
  spelare
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

    this.spelare = new PartiLedare(this, 50, 300, "vansterpartiet", this.input.keyboard.createCursorKeys())

    this.makten.push(this.spelare)
    this.makten.push(new PartiLedare(this, 150, 300, "socialdemokraterna"))
    this.makten.push(new PartiLedare(this, 250, 300, "miljöpartiet"))
    this.makten.push(new PartiLedare(this, 100, 400, "sverigedemokraterna"))
    this.makten.push(new PartiLedare(this, 200, 400, "moderaterna"))
    this.makten.push(new PartiLedare(this, 50, 500, "liberalerna"))
    this.makten.push(new PartiLedare(this, 150, 500, "kristdemokraterna"))
    this.makten.push(new PartiLedare(this, 250, 500, "centern"))
  }

  create() {
    console.log('Main Scene')

    for(let i = 0; i < 3; i++)
      this.add.sprite(Phaser.Math.Between(this.WIDTH/2, this.WIDTH*2), Phaser.Math.Between(0, this.HEIGHT), 'peng')

  }

  update() {
    let speed = this.minimum_speed

    for(let i = 0; i < this.makten.length; i++){
      this.makten[i].update(speed)

      if(this.makten[i].x < this.kill_line){
        if (this.spelare == this.makten[i])
          this.scene.start('PostScene')  
          this.makten[i].destroy()
      }
    }
    
    // Game speed and state stuff
    //if (this.spelare.x < this.kill_line){
    //  this.scene.start('PostScene')
    //}
    //else if (this.player.x >= this.kill_line + this.WIDTH/2 && this.cursors.right.isDown)
    //  this.kill_line = this.player.x - this.WIDTH/2


      // update drawn background
      this.mark.tilePositionX += speed
      this.bg1.tilePositionX += speed * 0.75
      this.bg2.tilePositionX += speed * 0.5
      this.bg3.tilePositionX += speed * 0.25
  }
}
