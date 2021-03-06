import EventEmitter from 'eventemitter3'
import { DataMessage } from './messageTypes'
import { ClientEvents } from './clientEvents'
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
    }

    channel.onerror = event => {
      console.error(`Channel ${id} error!`, event)
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
      if (channel.readyState === 'open') {
        channel.send(JSON.stringify({ ...message, senderId: this.clientId }))
      }
    }
  }

  public lockRoom() {}

  protected addConnection(peerConnection: RTCPeerConnection, clientId: string) {
    if (this.isHost) {
      this.addHostConnection(peerConnection, clientId)
    } else {
      this.addPeerConnection(peerConnection, clientId)
    }
  }

  protected removeConnection(clientId: string) {
    const channel = this.channels[clientId]
    channel.close()

    this.removeChannel(clientId)
  }

  connect(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
