import { DataMessage } from './dataTypes'
import { IClientIdentity } from './types'

export const enum MESSAGE_TYPE {
  CREATE_ROOM = 'create-room',
  ROOM_CREATED = 'room-created',
  CLIENT_CONNECTED = 'client-connected',
  JOIN_ROOM = 'join-room',
  JOINED_ROOM = 'joined-room'
}

export type ClientEvents = {
  'game-data': [DataMessage]
  'client-connected': [IClientIdentity]
  'room-created': [string]
  'joined-room': []
}

export const CLIENT_NAME_UNKNOWN = 'NOT_SET'
