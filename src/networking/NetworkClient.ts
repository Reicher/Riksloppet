import EventEmitter from 'eventemitter3'
import { PlayerMoveMessage } from './dataTypes'
import { MessageOchestrator } from './MessageOchestrator'
import { ClientEvents } from './messageTypes'
import { IClient, IClientIdentity } from './types'

export class NetworkClientEmitter extends EventEmitter<ClientEvents> implements IClient {
  roomId: string
  isConnected: boolean
  clientName: string
  clientId: string
  ochestrator: MessageOchestrator
  isHost: boolean

  constructor() {
    super()
  }
  getConnectedClients(): IClientIdentity[] {
    throw new Error('Method not implemented.')
  }

  sendData(dataMessage: PlayerMoveMessage): void {
    throw new Error('Method not implemented.')
  }
  connect(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

export class NetworkClient {
  private static theInstance: NetworkClientEmitter
  public static get instance() {
    if (NetworkClient.theInstance) return NetworkClient.theInstance
    throw new Error('NetworkClient is not initialized!')
  }

  public static set instance(_instance: NetworkClientEmitter) {
    NetworkClient.theInstance = _instance
  }
}
