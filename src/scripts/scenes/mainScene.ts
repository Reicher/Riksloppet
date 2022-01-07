import Level from '../level'
import PartiLedare from '../partiLedare'

export default class MainScene extends Phaser.Scene {
  riksdagen //: PartiLedare[] = new Array(0)  
  spelare : PartiLedare
  levels : Level[] = []
  hinder : Phaser.Physics.Arcade.Group

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
    let realistisk = new Level(this, this.goal, 'mark', 'bakgrund1', 'bakgrund2')
    this.levels.push(realistisk)

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
    for(let i = 0; i < 3; i++)
      this.hinder.create(Phaser.Math.Between(this.WIDTH/2, this.WIDTH*2), Phaser.Math.Between(0, this.HEIGHT), 'peng')
  }

  update(time, delta) {
    let scroll_speed = 0
    let scroll_line = 300
    let cam = this.cameras.main

    this.physics.world.overlap(this.riksdagen, this.hinder, this.hinderCollision)
    this.physics.world.overlap(this.riksdagen, this.riksdagen, this.riksdagskollision)

    let most_x = 0
    this.riksdagen.children.each((ledamot: PartiLedare) => {
      if(cam.x > ledamot.x || ledamot.x > this.goal){
        ledamot.destroy()       
        if (ledamot.player)
          this.scene.start('PostScene')      
      } 

      ledamot.update(time, delta)

      if (ledamot.x > most_x)
        most_x = ledamot.x
      
      ledamot.setVelocityX(ledamot.speed[0] * delta)
      ledamot.setVelocityY(ledamot.speed[1] * delta)
    }) 

    cam.setPosition(scroll_line-most_x, 0)
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
