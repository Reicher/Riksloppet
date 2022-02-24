import { Parti } from '../scripts/scenes/constants'
import type { DataMessage } from './dataTypes'

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

export interface IPlayerIdentity extends IClientIdentity {
  parti?: Parti
}

export interface IClient extends IClientIdentity {
  sendData(dataMessage: DataMessage): void
  connect(): Promise<void>
}
