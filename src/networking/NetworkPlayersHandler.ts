import { Parti } from '../scripts/scenes/constants'
import { CharacterSelectedMessage, DataMessage, MESSAGE_TYPE } from './dataTypes'
import { NetworkClient } from './NetworkClient'
import { IClientIdentity, IPlayerIdentity } from './types'

type PlayerMoveCallback = (x: number, y: number) => void
export class NetworkPlayersHandler {
  private connectedPlayers: Record<string, IPlayerIdentity & { ready: boolean; onPlayerMove: PlayerMoveCallback }>
  private _selectedParti: Parti
  private networkClient: NetworkClient
  public onNewPlayer: (player: IPlayerIdentity) => void

  constructor(networkClient: NetworkClient) {
    this.connectedPlayers = {}
    this.networkClient = networkClient
    networkClient.addListener('client-connected', this.onClientConnected.bind(this))
    networkClient.addListener('game-data', this.onGameData.bind(this))
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
        this.addPlayerCharacter(data)
        break
      case MESSAGE_TYPE.PLAYER_MOVE:
        this.connectedPlayers[data.senderId].onPlayerMove(...data.payload)
      default:
        break
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

  public getConnectedPlayers() {
    return Object.values(this.connectedPlayers)
  }

  public selectParti(parti: Parti) {
    this._selectedParti = parti
    this.networkClient.sendData({
      type: MESSAGE_TYPE.CHARACTER_SELECTED,
      payload: parti
    })
  }

  public getSelectedParti() {
    return this._selectedParti
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
