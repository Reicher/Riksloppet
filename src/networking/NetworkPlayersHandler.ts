import { Parti } from '../scripts/scenes/constants'
import { CharacterSelectedMessage, DataMessage, MESSAGE_TYPE } from './dataTypes'
import { NetworkClient } from './NetworkClient'
import { IClientIdentity, IPlayerIdentity } from './types'

type PlayerMoveCallback = (x: number, y: number) => void
export class NetworkPlayersHandler {
  private connectedPlayers: Record<string, IPlayerIdentity & { ready: boolean; onPlayerMove: PlayerMoveCallback }>
  private networkClient: NetworkClient
  private pingId: NodeJS.Timer

  public onNewPlayer: (player: IPlayerIdentity) => void = () => {}

  constructor(networkClient: NetworkClient) {
    this.connectedPlayers = {}
    this.networkClient = networkClient
    networkClient.addListener('game-data', this.onGameData.bind(this))

    if (networkClient.isHost) {
      this.setupAsHost()
    } else {
      this.setupAsClient()
    }
  }

  private setupAsHost() {
    this.connectedPlayers[this.networkClient.clientId] = {
      clientId: this.networkClient.clientId,
      clientName: this.networkClient.clientName,
      isHost: true,
      onPlayerMove: () => {},
      ready: true
    }
    this.networkClient.addListener('client-connected', this.onClientConnected.bind(this))
  }

  private setupAsClient() {
    this.pingId = setInterval(() => {
      this.networkClient.sendData({
        type: MESSAGE_TYPE.GET_PLAYERS,
        payload: []
      })
    }, 1000 * 0.5)
  }

  private onClientConnected({ clientId, clientName, isHost }: IClientIdentity) {
    console.log('[NetworkPlayersHandler] added new client')
    this.connectedPlayers[clientId] = {
      clientId,
      clientName,
      isHost,
      ready: false,
      onPlayerMove: () => {}
    }
  }

  private onGameData(data: DataMessage) {
    switch (data.type) {
      case MESSAGE_TYPE.CHARACTER_SELECTED:
        if (this.networkClient.isHost) {
          this.addPlayerCharacter(data)
        }
        break
      case MESSAGE_TYPE.PLAYER_MOVE:
        this.connectedPlayers[data.senderId].onPlayerMove(...data.payload)
        break
      case MESSAGE_TYPE.GET_PLAYERS:
        this.networkClient.sendData({
          type: MESSAGE_TYPE.CONNECTED_PLAYERS,
          payload: Object.values(this.connectedPlayers).map(({ clientId, clientName, isHost, parti }) => ({
            clientId,
            clientName,
            isHost,
            parti
          }))
        })
        break
      case MESSAGE_TYPE.CONNECTED_PLAYERS:
        this.addConnectedPlayers(data.payload)
        break
      case MESSAGE_TYPE.START_GAME:
        if (!this.networkClient.isHost) {
          clearInterval(this.pingId)
        }
        break
      default:
        break
    }
  }

  private addConnectedPlayers(players: IPlayerIdentity[]) {
    for (const newPlayer of players) {
      if (newPlayer.clientId in this.connectedPlayers) {
        this.connectedPlayers[newPlayer.clientId] = {
          ...this.connectedPlayers[newPlayer.clientId],
          ...newPlayer
        }
      } else {
        this.connectedPlayers[newPlayer.clientId] = {
          ...newPlayer,
          ready: newPlayer.parti !== undefined,
          onPlayerMove: () => {}
        }
        console.log('[NetworkPlayersHandler] new player added', newPlayer)
        this.onNewPlayer(newPlayer)
      }
    }
  }

  private addPlayerCharacter({ senderId, payload: parti }: CharacterSelectedMessage) {
    if (!(senderId in this.connectedPlayers)) throw new Error('Tried to add parti to player that is not connected!?')
    console.log('[NetworkPlayersHandler] added client parti', parti)
    this.connectedPlayers[senderId].parti = parti
    this.connectedPlayers[senderId].ready = true

    this.onNewPlayer(this.connectedPlayers[senderId])
  }

  public isAllReady() {
    return Object.values(this.connectedPlayers).every(({ ready }) => ready)
  }

  public getConnectedPlayers(filterSelf = true) {
    if (filterSelf) {
      return Object.values(this.connectedPlayers).filter(({ clientId }) => this.networkClient.clientId !== clientId)
    }
    return Object.values(this.connectedPlayers)
  }

  public selectParti(parti: Parti) {
    this.connectedPlayers[this.networkClient.clientId].parti = parti
    this.networkClient.sendData({
      type: MESSAGE_TYPE.CHARACTER_SELECTED,
      payload: parti
    })
  }

  public replicatePlayerMove(x: number, y: number) {
    this.networkClient.sendData({
      type: MESSAGE_TYPE.PLAYER_MOVE,
      payload: [x, y]
    })
  }

  public onRemotePlayerMove(clientId: string, handler: PlayerMoveCallback) {
    this.connectedPlayers[clientId].onPlayerMove = handler
  }
}
