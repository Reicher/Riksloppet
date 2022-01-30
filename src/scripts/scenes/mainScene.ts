import { NONE } from 'phaser'
import PartiLedare from '../objects/partiLedare'
import Statist from '../objects/statist'

export default class MainScene extends Phaser.Scene {
  riksdagen : Phaser.Physics.Arcade.Group
  spelare: PartiLedare
  powerups: Phaser.Physics.Arcade.Group
  hinder: Phaser.Physics.Arcade.Group
  kastbar: Phaser.Physics.Arcade.Group

  statist: Phaser.Physics.Arcade.Group

  goal = 2500
  cursors

  vinnare : PartiLedare[]

  WIDTH: number
  HEIGHT: number

  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.WIDTH = this.sys.game.canvas.width
    this.HEIGHT = this.sys.game.canvas.height

    this.cameras.main.setBounds(0, 0, this.goal, this.HEIGHT, true)

    // Skapa Värld
    this.physics.world.setBounds(0, 140, this.goal + 100, this.HEIGHT - 140)
    this.physics.world.setBoundsCollision()

    // Bakground
    let himmel = this.add.tileSprite(0, 0, this.goal, this.HEIGHT, 'himmel')
    himmel.setOrigin(0).setScrollFactor(0.6)

    let mark = this.add.tileSprite(0, 0, this.goal, this.HEIGHT, 'gata')
    mark.setOrigin(0).setScrollFactor(1)

    // Spelare och motspelare
    this.spelare = new PartiLedare(this, 250, 200, 'vansterpartiet', this.input.keyboard.createCursorKeys())
    let partier = [
      this.spelare,
      new PartiLedare(this, 150, 200, 'socialdemokraterna'),
      new PartiLedare(this, 50, 200, 'miljöpartiet'),
      new PartiLedare(this, 100, 300, 'sverigedemokraterna'),
      new PartiLedare(this, 200, 300, 'moderaterna'),
      new PartiLedare(this, 50, 400, 'liberalerna'),
      new PartiLedare(this, 150, 400, 'kristdemokraterna'),
      new PartiLedare(this, 250, 400, 'centern')
    ]

    this.riksdagen = new Phaser.Physics.Arcade.Group(this.physics.world, this, partier)
    this.riksdagen.children.each((ledamot: any) => {
      ledamot.setCollideWorldBounds(true)
    })

    // Power ups och down
    this.powerups = new Phaser.Physics.Arcade.Group(this.physics.world, this)
    this.hinder = new Phaser.Physics.Arcade.Group(this.physics.world, this)
    this.statist = new Phaser.Physics.Arcade.Group(this.physics.world, this)

    // Förgrund
    let förgrund2 = this.add.tileSprite(0, this.HEIGHT - 100, this.goal, this.HEIGHT, 'förgrund2')
    förgrund2.setOrigin(0).setScrollFactor(1.5)
    förgrund2.depth = this.WIDTH + 10

    let förgrund1 = this.add.tileSprite(0, this.HEIGHT - 100, this.goal, this.HEIGHT, 'förgrund1')
    förgrund1.setOrigin(0).setScrollFactor(2)
    förgrund1.depth = this.WIDTH + 11

    this.vinnare = []
  }

  create() {
    console.log('Main Scene')
    for (let i = 0; i < 3; i++) {
      let hinder = this.hinder.create(
        Phaser.Math.Between(this.WIDTH / 2, this.goal),
        Phaser.Math.Between(170, this.HEIGHT - 100),
        'bil'
      )
      hinder.setImmovable(true)
      hinder.setBodySize(170, 50)
      hinder.body.setOffset(0, 50)
      hinder.depth = hinder.y
    }    

    let pos_top = this.WIDTH / 2
    let pos_bot = this.WIDTH / 2
    for (let i = 0; i < 40; i++) {
      pos_top = Phaser.Math.Between(pos_top + 50, pos_top + 120)
      pos_bot = Phaser.Math.Between(pos_bot + 50, pos_bot + 120)

      let pwup : any
      if (Phaser.Math.RND.integerInRange(0, 100) > 70) // Top 30 % is updut
        pwup = this.powerups.create( 0, 0, 'peng')
      else if(Phaser.Math.RND.integerInRange(0, 100) > 50) // Top 50-70 % is downdut
        pwup = this.powerups.create( 0, 0, 'neddut')
      else
        pwup = null
      let frame = Phaser.Math.RND.pick(['statist_kast', 'statist'])
      let top = new Statist(this, pos_top, 130, frame, pwup)
      this.statist.add(top, true)

      pwup = null
      if (Phaser.Math.RND.integerInRange(0, 100) > 70) // Top 30 % is updut
        pwup = this.powerups.create( 0, 0, 'peng')
      else if(Phaser.Math.RND.integerInRange(0, 100) > 50) // Top 50-70 % is downdut
        pwup = this.powerups.create( 0, 0, 'neddut')
      else
        pwup = null
      frame = Phaser.Math.RND.pick(['statist_kast', 'statist'])
      let bot = new Statist(this, pos_top, this.HEIGHT-70, frame, pwup)
      this.statist.add(bot, true)
    }

    this.physics.add.collider(this.riksdagen, this.hinder)
  }
  update(time, delta) {
    let most_x = 0
    let kill_line = this.cameras.main.worldView.x

    this.physics.world.overlap(this.riksdagen, this.powerups, this.powerupCollision)
    //this.physics.world.overlap(this.riksdagen, this.kastbar, this.kastbarCollision)
    //this.physics.world.overlap(this.riksdagen, this.riksdagen, this.riksdagskollision)
    this.physics.world.overlap(this.riksdagen, this.statist, this.statistCollision)

    this.riksdagen.children.each((ledamot: any) => {
      ledamot.update(time, delta)

      if (this.vinnare.length == 0 && ledamot.x > most_x) {
        most_x = ledamot.x
        this.cameras.main.centerOnX(most_x-150) // extra avstånd från mitten skärmen scrollar
      }

      if (kill_line > ledamot.x) {
        this.riksdagen.remove(ledamot, true, true)
      }
      
      if (ledamot.x > this.goal){
        this.vinnare.push(ledamot)
        this.riksdagen.remove(ledamot, true, true)        
      }
    })

    if (this.riksdagen.getLength() <= 0)
      this.scene.start('PostScene')
  }

  powerupCollision(partiledare, powerup) {
    if(powerup.key == 'peng')
      partiledare.max_speed += 20
    else if(powerup.key == 'neddut')
      partiledare.max_speed -= 20
    powerup.destroy()
  }

  statistCollision(partiledare, statist) {
    partiledare.knocked_out = 1
    statist.destroy()
  }

  riksdagskollision(partiledare, annat) {
    if (partiledare.punch) {
      annat.knocked_out = 0.7
    }
  }
}
