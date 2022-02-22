import { Level } from '../objects/level'
import { PlayerActor } from '../objects/PlayerActor'
import { PlayerController } from '../objects/PlayerController'
import { GameContext, IMultiplayerContext, ISinglePlayerContext } from '../objects/GameContext'
import { RemotePlayer } from '../objects/RemotePlayer'
import { UIHandler } from '../UI/UIHandler'
import { getLedamotForParti, getXPostitionForLedamot } from './constants'
import { NetworkedPlayerController } from '../objects/NetworkedPlayerController'

export const enum GAME_STATE {
  SETUP,
  LOBBY,
  WAITING_FOR_PLAYERS,
  LINE_UP,
  RUNNING,
  DONE
}

export class MainScene extends Phaser.Scene {
  riksdagen: Phaser.Physics.Arcade.Group
  spelare: PlayerController
  powerups: Phaser.Physics.Arcade.Group
  hinder: Phaser.Physics.Arcade.Group
  kastbar: Phaser.Physics.Arcade.Group
  statist: Phaser.Physics.Arcade.Group

  level: Level
  context: GameContext

  goal = 2500
  cursors
  state: GAME_STATE

  vinnare: PlayerActor[]

  WIDTH: number
  HEIGHT: number
  STREET_MAX_Y: number
  STREET_MIN_Y: number

  constructor() {
    super({ key: 'MainScene' })
  }

  init(context: GameContext) {
    console.log(`Starting a ${context.type} game.`)
    this.state = GAME_STATE.SETUP
    UIHandler.clearScreen()

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

    if (context.type === 'Multiplayer') {
      this.initMultiplayerGame(context)
    } else {
      this.initSingleplayerGame(context)
    }
  }

  private initSingleplayerGame(context: ISinglePlayerContext) {
    this.spelare = new PlayerController(
      this,
      0,
      0,
      getLedamotForParti(context.player.parti!),
      this.input.keyboard.createCursorKeys()
    )

    this.spelare.setCollideWorldBounds()
    this.riksdagen.add(this.spelare)
  }

  private initMultiplayerGame(context: IMultiplayerContext) {
    for (const player of context.playersHandler.getConnectedPlayers()) {
      const remotePlayer = new RemotePlayer(this, player, context.playersHandler)
      remotePlayer.setCollideWorldBounds(true)
      this.riksdagen.add(remotePlayer)
    }

    this.spelare = new NetworkedPlayerController(
      this,
      getLedamotForParti(context.player.parti!),
      this.input.keyboard.createCursorKeys(),
      context.player.clientName,
      context.playersHandler
    )

    this.spelare.setCollideWorldBounds()
    this.riksdagen.add(this.spelare)
  }

  lineUpPlayers() {
    const actors = this.riksdagen.getChildren().filter(object => object instanceof PlayerActor) as PlayerActor[]
    const sortedActors = actors.sort((a, b) => a.clientName.localeCompare(b.clientName))

    const streetHeight = this.STREET_MAX_Y - this.STREET_MAX_Y
    const actorSpacing = streetHeight / actors.length

    console.log(
      `[MainScene]`,
      sortedActors.map(({ key }) => key)
    )

    sortedActors.forEach((actor, index) => {
      const { height } = actor.getBounds()
      actor.y = this.STREET_MIN_Y - index * (actorSpacing - height / 2)
      actor.x = getXPostitionForLedamot(actor.key)
    })
  }

  create() {
    console.log('Main Scene')
    this.physics.add.collider(this.riksdagen, this.hinder)

    this.lineUpPlayers()
    this.state = GAME_STATE.RUNNING
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
