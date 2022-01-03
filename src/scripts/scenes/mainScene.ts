import PartiLedare from '../partiLedare'

export default class MainScene extends Phaser.Scene {
  makten : PartiLedare[] = new Array(0)  
  spelare : PartiLedare
  bg3
  bg2
  bg1
  mark

  goal = 700
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

    this.makten = []
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

  update(time, delta) {
    let hare_speed = 0
    let scroll_speed = 0.2
    for(let i = 0; i < this.makten.length; i++){
      // Look for dead
      if(this.makten[i].x < 0){
        if (this.spelare == this.makten[i])
          this.scene.start('PostScene')  
        this.makten[i].destroy()                
      } 
      else if (this.makten[i].x >= this.WIDTH/2){
        hare_speed = this.makten[i].speed[0]
        scroll_speed = scroll_speed * 1.2
      }

      this.makten[i].update()
    }

    // Set speeds
    for(let i = 0; i < this.makten.length; i++){
      this.makten[i].setVelocityX((this.makten[i].speed[0] - hare_speed) * delta)
      this.makten[i].setVelocityY(this.makten[i].speed[1] * delta)
    }

      // update drawn background
      this.mark.tilePositionX += scroll_speed * delta
      this.bg1.tilePositionX += scroll_speed * 0.75 * delta
      this.bg2.tilePositionX += scroll_speed * 0.5 * delta
      this.bg3.tilePositionX += scroll_speed * 0.25 * delta
  }
}
