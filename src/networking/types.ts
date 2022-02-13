import type { DataMessage } from './dataTypes'
import { MessageOchestrator } from './MessageOchestrator'

type SessionDescription = {
  sdp?: string
  type: RTCSdpType
}
export type ClientData = {
  clientName?: string
  answer?: SessionDescription
  offer?: SessionDescription
}

export type RoomData = {
  hostName: string
  hostId: string
}

export interface IClientIdentity {
  clientName: string
  clientId: string
  isHost: boolean
}

export interface IClient extends IClientIdentity {
  ochestrator: MessageOchestrator

  sendData(dataMessage: DataMessage): void
  connect(): Promise<void>
  getConnectedClients(): IClientIdentity[]
}
