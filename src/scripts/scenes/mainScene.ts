import PartiLedare from '../partiLedare'

export default class MainScene extends Phaser.Scene {
  riksdagen //: PartiLedare[] = new Array(0)  
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
    let partier = [this.spelare , 
      new PartiLedare(this, 150, 300, "socialdemokraterna"), 
      new PartiLedare(this, 250, 300, "miljöpartiet"),
      new PartiLedare(this, 100, 400, "sverigedemokraterna"), 
      new PartiLedare(this, 200, 400, "moderaterna"), 
      new PartiLedare(this, 50, 500, "liberalerna"), 
      new PartiLedare(this, 150, 500, "kristdemokraterna"),
      new PartiLedare(this, 250, 500, "centern")]
                              
    this.riksdagen = new Phaser.Physics.Arcade.Group(this.physics.world, this, partier)

  }

  create() {
    console.log('Main Scene')

    for(let i = 0; i < 3; i++)
      this.add.sprite(Phaser.Math.Between(this.WIDTH/2, this.WIDTH*2), Phaser.Math.Between(0, this.HEIGHT), 'peng')

  }

  update(time, delta) {
    let hare_speed = 0
    let scroll_speed = 0.2
    let partier = this.riksdagen.getChildren()
    console.log(this.riksdagen.getLength())
    for(let i = 0; i < this.riksdagen.getLength(); i++){
      let parti = partier[i]
      // Look for dead
      if(parti.x < 0){
        if (this.spelare == parti)
          this.scene.start('PostScene')  
        parti.destroy()                
      } 
      else if (parti.x >= this.WIDTH/2){
        hare_speed = parti.speed[0]
        scroll_speed = scroll_speed * 1.2
      }

      parti.update()
    }

    // Set speeds
    for(let i = 0; i < this.riksdagen.getLength(); i++){
      let parti = partier[i]
      parti.setVelocityX((parti.speed[0] - hare_speed) * delta)
      parti.setVelocityY(parti.speed[1] * delta)
    }

      // update drawn background
      this.mark.tilePositionX += scroll_speed * delta
      this.bg1.tilePositionX += scroll_speed * 0.75 * delta
      this.bg2.tilePositionX += scroll_speed * 0.5 * delta
      this.bg3.tilePositionX += scroll_speed * 0.25 * delta
  }
}
