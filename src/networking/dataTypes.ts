import { Parti } from '../scripts/scenes/constants'
import { IPlayerIdentity } from './types'

export const enum MESSAGE_TYPE {
  PLAYER_MOVE = 0,
  GET_PLAYERS,
  CONNECTED_PLAYERS,
  START_GAME,
  CHARACTER_SELECTED
}
export type BaseDataMessage<TType extends MESSAGE_TYPE = MESSAGE_TYPE, TPayload extends any = []> = {
  type: TType
  senderId: string
  payload: TPayload
}
export type PlayerMoveMessage = BaseDataMessage<MESSAGE_TYPE.PLAYER_MOVE, [x: number, y: number]>
export type StartGameMessage = BaseDataMessage<MESSAGE_TYPE.START_GAME>
export type CharacterSelectedMessage = BaseDataMessage<MESSAGE_TYPE.CHARACTER_SELECTED, Parti>
export type GetPlayersMessage = BaseDataMessage<MESSAGE_TYPE.GET_PLAYERS>
export type ConnectedPlayersMessage = BaseDataMessage<MESSAGE_TYPE.CONNECTED_PLAYERS, IPlayerIdentity[]>

export type DataMessage =
  | PlayerMoveMessage
  | StartGameMessage
  | CharacterSelectedMessage
  | GetPlayersMessage
  | ConnectedPlayersMessage
