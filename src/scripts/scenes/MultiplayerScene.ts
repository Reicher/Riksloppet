import { PlayerActor } from '../objects/PlayerActor'
import MainScene, { GAME_STATE } from './MainScene'
import { DataMessage, MESSAGE_TYPE, PlayerMoveMessage } from '../../networking/dataTypes'
import { getRandomLedamot, Parti } from './constants'
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
    this.clients = new Map()
  }

  create(): void {
    super.create()
    const connectedClients = NetworkClient.instance.getConnectedClients()
    for (const client of connectedClients) {
      const actor = this.createPlayerActor(client.clientName)
      this.clients.set(client.clientId, {
        client,
        actor
      })
    }

    this.state = GAME_STATE.LINE_UP
  }

  private createPlayerActor(clientName: string) {
    const player = new PlayerActor(this, 0, 0, getRandomLedamot())
    player.clientName = clientName
    player.setCollideWorldBounds()
    this.riksdagen.add(player)
    return player
  }

  private onGameData(data: DataMessage) {
    const [fromClientId, messageType, ...messageData] = data
    switch (messageType) {
      case MESSAGE_TYPE.PLAYER_MOVE:
        this.movePlayer(fromClientId, ...messageData)
        break
      default:
        break
    }
  }

  private movePlayer(clientId: string, x: number, y: number) {
    if (!this.clients.has(clientId)) return
    this.clients.get(clientId)?.actor.setPosition(x, y)
  }

  playerMoved(player: PlayerController): void {
    const moveMessage: PlayerMoveMessage = [
      NetworkClient.instance.clientId,
      MESSAGE_TYPE.PLAYER_MOVE,
      player.x,
      player.y
    ]
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
