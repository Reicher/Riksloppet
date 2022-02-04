import { DataMessage } from './dataTypes'

export const enum MESSAGE_TYPE {
  CREATE_ROOM = 0,
  ROOM_CREATED,
  CLIENT_CONNECTED,
  JOIN_ROOM,
  JOINED_ROOM
}

export type ClientEvents = {
  'game-data': [DataMessage]
  'client-connected': [ClientIdentity]
  'room-created': [string]
  'joined-room': []
}

export const CLIENT_NAME_UNKNOWN = 'NOT_SET'

export type ClientIdentity = { clientName: string; clientId: string }
type BaseMessage<T extends MESSAGE_TYPE, TData> = {
  type: T
  data: TData
}
type MessageCtor<TMessage> = TMessage extends BaseMessage<infer TType, infer TData> ? (data: TData) => TMessage : never

type RoomMessage = BaseMessage<MESSAGE_TYPE.CREATE_ROOM, ClientIdentity>
export const createRoomMessage: MessageCtor<RoomMessage> = data => ({
  type: MESSAGE_TYPE.CREATE_ROOM,
  data
})

type RoomCreatedMessage = BaseMessage<MESSAGE_TYPE.ROOM_CREATED, string>
export const roomCreatedMessage: MessageCtor<RoomCreatedMessage> = roomId => ({
  type: MESSAGE_TYPE.ROOM_CREATED,
  data: roomId
})

type ClientConnectedMessage = BaseMessage<MESSAGE_TYPE.CLIENT_CONNECTED, ClientIdentity>
export const clientConnectedMessage: MessageCtor<ClientConnectedMessage> = data => ({
  type: MESSAGE_TYPE.CLIENT_CONNECTED,
  data
})

type JoinRoomMessage = BaseMessage<MESSAGE_TYPE.JOIN_ROOM, ClientIdentity & { roomId: string }>
export const joinRoomMessage: MessageCtor<JoinRoomMessage> = data => ({
  type: MESSAGE_TYPE.JOIN_ROOM,
  data
})

type JoinedRoomMessage = BaseMessage<MESSAGE_TYPE.JOINED_ROOM, unknown>
export const joinedRoomMessage: MessageCtor<JoinedRoomMessage> = () => ({
  type: MESSAGE_TYPE.JOINED_ROOM,
  data: undefined
})

export type Message = RoomMessage | RoomCreatedMessage | ClientConnectedMessage | JoinRoomMessage | JoinedRoomMessage
