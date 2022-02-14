import { PlayerActor } from '../objects/PlayerActor'
import MainScene, { GAME_STATE } from './MainScene'
import { DataMessage, MESSAGE_TYPE, PlayerMoveMessage } from '../../networking/dataTypes'
import { getLedamotForParti, getRandomLedamot, Parti } from './constants'
import { NetworkClient } from '../../networking/NetworkClient'
import { IClientIdentity } from '../../networking/types'
import { UIHandler } from '../UI/UIHandler'
import { PlayerController } from '../objects/PlayerController'

type ConnectedClient = {
  client: IClientIdentity
  actor: PlayerActor
}
export class MultiplayerScene extends MainScene {
  clients: Map<string, ConnectedClient>

  constructor() {
    super('MultiplayerScene')
  }

  init(partiVal: Parti) {
    this.state = GAME_STATE.SETUP
    super.init(partiVal)

    UIHandler.clearScreen()
    NetworkClient.instance.addListener('game-data', this.onGameData.bind(this))
    NetworkClient.instance.sendData({
      type: MESSAGE_TYPE.CHARACTER_SELECTED,
      payload: partiVal
    })
    this.clients = new Map()
  }

  create(): void {
    super.create()

    this.state = GAME_STATE.LINE_UP
  }

  private createPlayerActor(clientId: string, parti: Parti) {
    const clientName = NetworkClient.instance
      .getConnectedClients()
      .find(client => client.clientId === clientId)?.clientName
    if (!clientName) return

    const player = new PlayerActor(this, 0, 0, getLedamotForParti(parti))
    player.clientName = clientName
    player.setCollideWorldBounds()
    this.riksdagen.add(player)
    return player
  }

  private onGameData(data: DataMessage) {
    switch (data.type) {
      case MESSAGE_TYPE.PLAYER_MOVE:
        this.movePlayer(data.senderId, ...data.payload)
        break
      case MESSAGE_TYPE.CHARACTER_SELECTED:
        this.createPlayerActor(data.senderId, data.payload)
      default:
        break
    }
  }

  private movePlayer(clientId: string, x: number, y: number) {
    if (!this.clients.has(clientId)) return
    this.clients.get(clientId)?.actor.setPosition(x, y)
  }

  playerMoved(player: PlayerController): void {
    const moveMessage: PlayerMoveMessage = {
      senderId: NetworkClient.instance.clientId,
      type: MESSAGE_TYPE.PLAYER_MOVE,
      payload: [player.x, player.y]
    }
    NetworkClient.instance.sendData(moveMessage)
  }

  update(time: any, delta: any): void {
    if (this.state === GAME_STATE.LINE_UP) {
      this.lineUpPlayers()
      this.state = GAME_STATE.RUNNING
    }
    super.update(time, delta)
  }
}
