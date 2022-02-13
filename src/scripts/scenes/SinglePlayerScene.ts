import { AIPlayerController } from '../objects/aiPlayerController'
import { getRandomLedamot, Parti } from './constants'
import MainScene, { GAME_STATE } from './MainScene'

const AI_PLAYER_COUNT = 8

export class SinglePlayerScene extends MainScene {
  constructor() {
    super('SinglePlayerScene')
  }

  init(parti_val: Parti): void {
    this.state = GAME_STATE.SETUP
    super.init(parti_val)

    this.initializeAIPlayers()
  }

  private initializeAIPlayers() {
    for (let i = 0; i < AI_PLAYER_COUNT; i++) {
      this.createAIPlayer()
    }
  }

  private createAIPlayer() {
    const player = new AIPlayerController(this, 0, 0, getRandomLedamot())
    player.setCollideWorldBounds()
    this.riksdagen.add(player)
  }

  create(): void {
    console.log('Create SinglePlayerScene')
    super.create()
    this.state = GAME_STATE.LINE_UP
  }

  update(time: any, delta: any): void {
    if (this.state === GAME_STATE.LINE_UP) {
      this.lineUpPlayers()
      this.state = GAME_STATE.RUNNING
    }
    super.update(time, delta)
  }
}
