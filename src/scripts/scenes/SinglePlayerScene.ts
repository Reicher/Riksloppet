import { AIPlayerController } from '../objects/aiPlayerController'
import { PlayerController } from '../objects/PlayerController'
import { getRandomLedamot, PARTI_LEDAMOT } from './constants'
import MainScene, { GAME_STATE } from './mainScene'

const AI_PLAYER_COUNT = 8

export class SinglePlayerScene extends MainScene {
  constructor() {
    super('SinglePlayerScene')
  }

  init(): void {
    console.log('INIT')
    super.init()

    this.initializeSpelare()
    this.initializeAIPlayers()
  }

  private initializeAIPlayers() {
    for (let i = 0; i < AI_PLAYER_COUNT; i++) {
      this.createAIPlayer()
    }
  }

  private initializeSpelare() {
    this.spelare = new PlayerController(
      this,
      250,
      200,
      PARTI_LEDAMOT.VÄNSTERPARTIST,
      this.input.keyboard.createCursorKeys()
    )
    this.spelare.clientName = PARTI_LEDAMOT.VÄNSTERPARTIST
    this.spelare.setCollideWorldBounds()
    this.riksdagen.add(this.spelare)
  }

  private createAIPlayer() {
    const player = new AIPlayerController(this, 0, 0, getRandomLedamot())
    player.setCollideWorldBounds()
    this.riksdagen.add(player)
  }

  create(): void {
    console.log('Create SinglePlayerScene')
    super.create()
  }

  update(time: any, delta: any): void {
    if (this.state === GAME_STATE.LINE_UP) {
      this.startGame()
    }
    super.update(time, delta)
  }
}
