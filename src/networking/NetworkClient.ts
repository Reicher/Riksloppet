import EventEmitter from 'eventemitter3'
import { v4 as uuid } from 'uuid'
import { ClientEvents, CLIENT_NAME_UNKNOWN } from './messageTypes'
import { MessageOchestrator } from './MessageOchestrator'
import { DataMessage } from './dataTypes'

export class NetworkClient extends EventEmitter<ClientEvents> {
  static CLIENT_ID: string = uuid()
  clientName: string
  isHost: boolean
  isConnected: boolean
  roomId?: string
  ochestrator: MessageOchestrator

  constructor(_ochestrator = new MessageOchestrator()) {
    super()
    this.clientName = CLIENT_NAME_UNKNOWN
    this.ochestrator = _ochestrator
    this.initialize()
  }

  protected initialize() {
    this.isConnected = false
    this.roomId = undefined
  }

  public sendData(dataMessage: DataMessage) {
    this.ochestrator.sendMessage(dataMessage)
  }
}
