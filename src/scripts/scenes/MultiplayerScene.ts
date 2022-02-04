import { PlayerActor } from '../objects/PlayerActor'
import MainScene from './mainScene'
import { ClientIdentity } from '../../networking/messageTypes'
import { DataMessage, MESSAGE_TYPE, PlayerMoveMessage } from '../../networking/dataTypes'
import { NetworkClient } from '../../networking/NetworkClient'
import { getRandomLedamot, PARTI_LEDAMOT } from './constants'
import { PlayerController } from '../objects/PlayerController'

type ConnectedClient = {
  clientName: string
  actor: PlayerActor
}
export class MultiplayerScene extends MainScene {
  client: NetworkClient
  clients: Map<string, ConnectedClient>

  constructor() {
    super('MultiplayerScene')
  }

  init() {
    super.init()

    this.clients = new Map()
    this.client = new NetworkClient()
    this.client.addListener('client-connected', this.onClientConnected)
    this.client.addListener('game-data', this.onGameData)

    this.initializeSpelare()
  }

  private initializeSpelare() {
    this.spelare = new PlayerController(
      this,
      0,
      0,
      PARTI_LEDAMOT.MILJÖPARTIST,
      this.input.keyboard.createCursorKeys(),
      this
    )
    this.spelare.setCollideWorldBounds()
    this.riksdagen.add(this.spelare)
  }

  private onClientConnected({ clientId, clientName }: ClientIdentity) {
    const player = this.createPlayerActor()
    this.clients.set(clientId, {
      clientName,
      actor: player
    })
  }

  private createPlayerActor() {
    const player = new PlayerActor(this.scene, 0, 0, getRandomLedamot())
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

  public playerMoved(player: PlayerActor) {
    const moveMessage: PlayerMoveMessage = [this.client.clientId, MESSAGE_TYPE.PLAYER_MOVE, player.x, player.y]
    this.client.sendData(moveMessage)
  }

  public createGame(clientName: string) {
    this.client.createRoom(clientName)

    return new Promise<string>(resolve => {
      this.client.once('room-created', resolve)
    })
  }

  public joinGame(clientName: string, roomId: string) {
    this.client.joinRoom(clientName, roomId)
  }
}
