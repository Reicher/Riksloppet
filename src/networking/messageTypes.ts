import { Parti } from '../scripts/scenes/constants'
import { IPlayerIdentity } from './types'

export const enum MESSAGE_TYPE {
  PLAYER_MOVE = 0,
  GET_PLAYERS,
  CONNECTED_PLAYERS,
  PLAYER_DISCONNECT,
  START_GAME,
  CHARACTER_SELECTED,
  CREATE_GAME_OBJECT
}
export type BaseDataMessage<TType extends MESSAGE_TYPE = MESSAGE_TYPE, TPayload extends any = []> = {
  type: TType
  senderId: string
  payload: TPayload
}
export type PlayerMoveMessage = BaseDataMessage<
  MESSAGE_TYPE.PLAYER_MOVE,
  [dirX: number, dirY: number, posX: number, posY: number]
>
export type StartGameMessage = BaseDataMessage<MESSAGE_TYPE.START_GAME>
export type CharacterSelectedMessage = BaseDataMessage<MESSAGE_TYPE.CHARACTER_SELECTED, Parti>
export type GetPlayersMessage = BaseDataMessage<MESSAGE_TYPE.GET_PLAYERS>
export type ConnectedPlayersMessage = BaseDataMessage<MESSAGE_TYPE.CONNECTED_PLAYERS, IPlayerIdentity[]>
export type PlayerDisconnectedMessage = BaseDataMessage<MESSAGE_TYPE.PLAYER_DISCONNECT, IPlayerIdentity>

export const enum GAME_OBJECT_TYPE {
  STATIST,
  HINDER
}

export type CreateHinderPayload = {
  type: GAME_OBJECT_TYPE.HINDER
  data: {
    x: number
    y: number
  }
}

export type CreateStatistPayload = {
  type: GAME_OBJECT_TYPE.STATIST
  data: {
    sX: number
    sY: number
    pX?: number
    pY?: number
    frame: string
  }
}

export type CreateGameObjectMessagePayload = CreateStatistPayload | CreateHinderPayload
export type CreateGameObjectMessage = BaseDataMessage<MESSAGE_TYPE.CREATE_GAME_OBJECT, CreateGameObjectMessagePayload>

export type DataMessage =
  | PlayerMoveMessage
  | StartGameMessage
  | CharacterSelectedMessage
  | GetPlayersMessage
  | ConnectedPlayersMessage
  | PlayerDisconnectedMessage
  | CreateGameObjectMessage
