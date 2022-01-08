import { NONE } from 'phaser'
import Level from '../level'
import PartiLedare from '../partiLedare'

export default class MainScene extends Phaser.Scene {
  riksdagen //: PartiLedare[] = new Array(0)  
  spelare : PartiLedare
  levels : Level[] = []
  level : Level
  hinder : Phaser.Physics.Arcade.Group

  goal = 1400
  cursors

  WIDTH : number
  HEIGHT : number

  constructor() {
    super({ key: 'MainScene' })

  }

  init() {    
    this.WIDTH = this.sys.game.canvas.width;
    this.HEIGHT = this.sys.game.canvas.height;    
    this.level = new Level(this, this.goal, 'gata', 'himmel')

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

    let cam = this.cameras.main
    let most_x = 0
    let kill_line = cam.worldView.x

    this.physics.world.overlap(this.riksdagen, this.hinder, this.hinderCollision)
    this.physics.world.overlap(this.riksdagen, this.riksdagen, this.riksdagskollision)

    this.level.update(time, delta, 0)

    this.riksdagen.children.each((ledamot: PartiLedare) => {

      ledamot.update(time, delta)

      if (ledamot.x > most_x){
        most_x = ledamot.x
        cam.centerOnX(most_x)
      }

      if(kill_line > ledamot.x || ledamot.x > this.goal){
        this.riksdagen.remove(ledamot, true, true)
        if (ledamot.player)
          this.scene.start('PostScene')          
      }
    }) 

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
