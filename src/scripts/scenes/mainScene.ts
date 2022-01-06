import PartiLedare from '../partiLedare'

export default class MainScene extends Phaser.Scene {
  riksdagen //: PartiLedare[] = new Array(0)  
  spelare : PartiLedare
  hinder

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
    let partier = [this.spelare , 
      new PartiLedare(this, 150, 300, "socialdemokraterna"), 
      new PartiLedare(this, 250, 300, "miljöpartiet"),
      new PartiLedare(this, 100, 400, "sverigedemokraterna"), 
      new PartiLedare(this, 200, 400, "moderaterna"), 
      new PartiLedare(this, 50, 500, "liberalerna"), 
      new PartiLedare(this, 150, 500, "kristdemokraterna"),
      new PartiLedare(this, 250, 500, "centern")]
                              
    this.riksdagen = new Phaser.Physics.Arcade.Group(this.physics.world, this, partier)
    this.hinder = new Phaser.Physics.Arcade.Group(this.physics.world, this)

  }

  create() {
    console.log('Main Scene')
    this.hinder.enableBody = true;
    for(let i = 0; i < 3; i++)
      this.hinder.create(Phaser.Math.Between(this.WIDTH/2, this.WIDTH*2), Phaser.Math.Between(0, this.HEIGHT), 'peng')
  }

  update(time, delta) {
    let hare_speed = 0
    let scroll_speed = 0.1

    this.physics.world.overlap(this.riksdagen, this.hinder, this.hinderCollision)
    this.physics.world.overlap(this.riksdagen, this.riksdagen, this.riksdagskollision)

    for(let i = 0; i < this.riksdagen.getLength(); i++){
      let parti = this.riksdagen.getChildren()[i]
      // Look for dead
      if(parti.x < 0){
        if (this.spelare == parti)
          this.scene.start('PostScene')  
        parti.destroy()                
      } 
      else if (parti.x >= this.WIDTH*0.7){
        hare_speed = parti.speed[0]
        //scroll_speed = scroll_speed * 2
      }
      parti.update(time, delta)
    }

    // Set speeds
    for(let i = 0; i < this.riksdagen.getLength(); i++){
      let parti = this.riksdagen.getChildren()[i]
      parti.setVelocityX((parti.speed[0] - hare_speed) * delta)
      parti.setVelocityY(parti.speed[1] * delta)
    }

    for(let i = 0; i < this.hinder.getLength(); i++){      
      let hinder = this.hinder.getChildren()[i]
      hinder.x = hinder.x - scroll_speed * delta
    }

    // update drawn background
    this.mark.tilePositionX += scroll_speed * delta
    this.bg1.tilePositionX += scroll_speed * 0.75 * delta
    this.bg2.tilePositionX += scroll_speed * 0.5 * delta
    this.bg3.tilePositionX += scroll_speed * 0.25 * delta
  }

  hinderCollision(partiledare, annat){
      partiledare.knocked_out = 1
  }

  riksdagskollision(partiledare, annat){
    if (partiledare.punch){
        annat.knocked_out = 1
    }               
  }
}
