import EventEmitter from 'eventemitter3'
import { DataMessage } from './dataTypes'
import { ClientEvents } from './messageTypes'
import { IClient, IClientIdentity } from './types'
import { v4 as uuid } from 'uuid'

const DATA_CHANNEL_LABEL = 'DATA_CHANNEL'

export class NetworkClient extends EventEmitter<ClientEvents> implements IClient {
  protected channels: Record<string, RTCDataChannel>

  roomId: string
  isConnected: boolean
  clientName: string
  clientId: string
  isHost: boolean

  constructor(_clientId = uuid()) {
    super()
    this.clientId = _clientId
    this.channels = {}
  }

  private echoMessage(message: DataMessage, skipChannelId: string) {
    for (const [id, channel] of Object.entries(this.channels)) {
      if (id !== skipChannelId) {
        channel.send(JSON.stringify(message))
      }
    }
  }

  private setupChannel(channel: RTCDataChannel, id: string) {
    channel.onmessage = event => {
      const message = JSON.parse(event.data) as DataMessage
      this.emit('game-data', message)
      if (this.isHost) {
        this.echoMessage(message, id)
      }
    }

    channel.onclose = () => {
      console.log(`Channel ${id} closed!`)
      this.removeChannel(id)
    }

    channel.onerror = event => {
      console.error(`Channel ${id} error!`, event)
      this.removeChannel(id)
    }

    channel.onopen = () => {
      console.log(`Channel ${id} connected!`)
    }

    this.channels[id] = channel
  }

  private removeChannel(id: string) {
    delete this.channels[id]
  }

  private addPeerConnection(peerConnection: RTCPeerConnection, clientId: string) {
    peerConnection.ondatachannel = event => this.setupChannel(event.channel, clientId)
  }

  private addHostConnection(peerConnection: RTCPeerConnection, clientId) {
    const channel = peerConnection.createDataChannel(DATA_CHANNEL_LABEL)
    this.setupChannel(channel, clientId)
  }

  public sendData(message: Omit<DataMessage, 'senderId'>) {
    for (const channel of Object.values(this.channels)) {
      channel.send(JSON.stringify({ ...message, senderId: this.clientId }))
    }
  }

  protected addConnection(peerConnection: RTCPeerConnection, clientId: string) {
    if (this.isHost) this.addHostConnection(peerConnection, clientId)
    this.addPeerConnection(peerConnection, clientId)
  }

  getConnectedClients(): IClientIdentity[] {
    throw new Error('Method not implemented.')
  }

  connect(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
