import { Level } from '../objects/level'
import { PlayerActor } from '../objects/PlayerActor'
import { PlayerController } from '../objects/PlayerController'
import { getXPostitionForLedamot } from './constants'

export const enum GAME_STATE {
  SETUP,
  LOBBY,
  LINE_UP,
  RUNNING,
  DONE
}

export default class MainScene extends Phaser.Scene {
  riksdagen: Phaser.Physics.Arcade.Group
  spelare: PlayerController
  powerups: Phaser.Physics.Arcade.Group
  hinder: Phaser.Physics.Arcade.Group
  kastbar: Phaser.Physics.Arcade.Group
  statist: Phaser.Physics.Arcade.Group

  level: Level

  goal = 2500
  cursors
  state: GAME_STATE

  vinnare: PlayerActor[]

  WIDTH: number
  HEIGHT: number
  STREET_MAX_Y: number
  STREET_MIN_Y: number

  constructor(key: string) {
    super({ key })
  }

  init(parti_val: string) {
    console.log('Spelare valde: ' + parti_val)
    this.WIDTH = this.sys.game.canvas.width
    this.HEIGHT = this.sys.game.canvas.height
    this.STREET_MAX_Y = this.HEIGHT - 100
    this.STREET_MIN_Y = 170

    this.cameras.main.setBounds(0, 0, this.goal, this.HEIGHT, true)

    this.riksdagen = new Phaser.Physics.Arcade.Group(this.physics.world, this)

    // Power ups och down
    this.powerups = new Phaser.Physics.Arcade.Group(this.physics.world, this)
    this.hinder = new Phaser.Physics.Arcade.Group(this.physics.world, this)
    this.statist = new Phaser.Physics.Arcade.Group(this.physics.world, this)

    this.level = new Level(this, this.goal, 0, this.statist, this.hinder, this.powerups)

    this.vinnare = []
  }

  lineUpPlayers() {
    const actors = this.riksdagen.getChildren().filter(object => object instanceof PlayerActor) as PlayerActor[]
    const sortedActors = actors.sort((a, b) => a.clientName.localeCompare(b.clientName))

    const streetHeight = this.STREET_MAX_Y - this.STREET_MAX_Y
    const actorSpacing = streetHeight / actors.length

    sortedActors.forEach((actor, index) => {
      const { height } = actor.getBounds()
      actor.y = this.STREET_MIN_Y - index * (actorSpacing - height / 2)
      actor.x = getXPostitionForLedamot(actor.key)
    })
  }

  create() {
    console.log('Main Scene')
    this.physics.add.collider(this.riksdagen, this.hinder)
  }

  update(time, delta) {
    if (this.state !== GAME_STATE.RUNNING) {
      return
    }

    let most_x = 0
    let kill_line = this.cameras.main.worldView.x

    this.physics.world.overlap(this.riksdagen, this.powerups, this.powerupCollision)
    //this.physics.world.overlap(this.riksdagen, this.riksdagen, this.riksdagskollision)
    this.physics.world.overlap(this.riksdagen, this.statist, this.statistCollision)

    this.riksdagen.children.each((ledamot: any) => {
      ledamot.update(time, delta)

      if (this.vinnare.length == 0 && ledamot.x > most_x) {
        most_x = ledamot.x
        this.cameras.main.centerOnX(most_x - 150) // extra avstånd från mitten skärmen scrollar
      }

      if (kill_line > ledamot.x) {
        this.riksdagen.remove(ledamot, true, true)
      }

      if (ledamot.x > this.goal) {
        this.vinnare.push(ledamot)
        this.riksdagen.remove(ledamot, true, true)
      }
    })

    if (this.riksdagen.getLength() <= 0) {
      this.state = GAME_STATE.DONE
      this.scene.start('PostScene')
    }
    this.level.update(time, delta, kill_line + this.WIDTH)
  }

  powerupCollision(partiledare, powerup) {
    if (powerup.key == 'peng') partiledare.max_speed += 20
    else if (powerup.key == 'neddut') partiledare.max_speed -= 20
    powerup.destroy()
  }

  statistCollision(partiledare, statist) {
    statist.collidedWith(partiledare)
  }

  riksdagskollision(partiledare, annat) {
    if (partiledare.punch) {
      annat.knocked_out = 0.7
    }
  }
}
