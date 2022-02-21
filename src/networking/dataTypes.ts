import { Parti } from '../scripts/scenes/constants'

export const enum MESSAGE_TYPE {
  PLAYER_MOVE = 0,
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

export type DataMessage = PlayerMoveMessage | StartGameMessage | CharacterSelectedMessage
