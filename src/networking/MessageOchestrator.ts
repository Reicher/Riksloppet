import { v4 as uuid } from 'uuid'
import { DataMessage } from './dataTypes'

const DATA_CHANNEL_LABEL = 'DATA_CHANNEL'

export class MessageOchestrator {
  private channels: Record<string, RTCDataChannel>
  private isHost: boolean

  constructor() {
    this.channels = {}
    this.isHost = false
  }

  private echoMessage(message: DataMessage, skipChannelId: string) {
    for (const [id, channel] of Object.entries(this.channels)) {
      if (id !== skipChannelId) {
        channel.send(JSON.stringify(message))
      }
    }
  }

  private setupChannel(channel: RTCDataChannel, id = uuid()) {
    channel.onmessage = event => {
      const message = JSON.parse(event.data) as DataMessage
      postMessage(message)
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

  private addPeerConnection(peerConnection: RTCPeerConnection) {
    peerConnection.ondatachannel = event => this.setupChannel(event.channel)
  }

  private addHostConnection(peerConnection: RTCPeerConnection) {
    const channel = peerConnection.createDataChannel(DATA_CHANNEL_LABEL)
    this.setupChannel(channel)
  }

  public sendMessage(message: DataMessage) {
    for (const channel of Object.values(this.channels)) {
      channel.send(JSON.stringify(message))
    }
  }

  public addConnection(peerConnection: RTCPeerConnection) {
    if (this.isHost) this.addHostConnection(peerConnection)
    this.addPeerConnection(peerConnection)
  }

  public setAsHost() {
    this.isHost = true
  }
}
