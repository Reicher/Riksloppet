import EventEmitter from 'eventemitter3'
import { v4 as uuid } from 'uuid'
import {
  ClientEvents,
  CLIENT_NAME_UNKNOWN,
  createRoomMessage,
  joinRoomMessage,
  Message,
  MESSAGE_TYPE
} from './messageTypes'
import { DataMessage, isDataMessage } from './dataTypes'

const emitter = new EventEmitter<ClientEvents>()

export class NetworkClient extends EventEmitter<ClientEvents> {
  clientName: string
  public clientId: string
  worker: Worker
  isHost: boolean
  isConnected: boolean
  roomId?: string

  constructor() {
    super()
    this.clientName = CLIENT_NAME_UNKNOWN
    this.clientId = uuid()
    this.worker = new Worker(new URL('./worker/background.worker.ts', import.meta.url))
    this.initialize()
  }

  private initialize() {
    this.worker.addEventListener('message', this.onWorkerMessage)
    this.isConnected = false
    this.isHost = false
    this.roomId = undefined
  }

  private onWorkerMessage({ data }: MessageEvent<Message | DataMessage>) {
    if (isDataMessage(data)) {
      this.emit('game-data', data)
      return
    }

    switch (data.type) {
      case MESSAGE_TYPE.ROOM_CREATED:
        this.isConnected = true
        emitter.emit('room-created', data.data)
        break
      case MESSAGE_TYPE.CLIENT_CONNECTED:
        emitter.emit('client-connected', data.data)
        break
      case MESSAGE_TYPE.JOINED_ROOM:
        this.isConnected = true
        emitter.emit('joined-room')
      default:
        break
    }
  }

  public createRoom(clientName: string) {
    if (this.isConnected) {
      console.error('Tried to connect whilst allready being connected')
      return
    }

    this.isHost = true
    this.clientName = clientName
    this.worker.postMessage(createRoomMessage({ clientId: this.clientId, clientName }))
  }

  public joinRoom(clientName: string, roomId: string) {
    if (this.isConnected) {
      console.error('Tried to connect whilst allready being connected')
      return
    }

    this.isHost = false
    this.roomId = roomId
    this.clientName = clientName
    this.worker.postMessage(joinRoomMessage({ clientId: this.clientId, clientName, roomId }))
  }

  public sendData(dataMessage: DataMessage) {
    this.worker.postMessage(dataMessage)
  }
}
