import { Parti } from '../scripts/scenes/constants'

export const enum MESSAGE_TYPE {
  PLAYER_MOVE = 0,
  GOTO_LOBBY,
  CHARACTER_SELECTED
}
export type BaseDataMessage<TType extends MESSAGE_TYPE = MESSAGE_TYPE, TPayload extends any = []> = {
  type: TType
  senderId: string
  payload: TPayload
}
export type PlayerMoveMessage = BaseDataMessage<MESSAGE_TYPE.PLAYER_MOVE, [x: number, y: number]>
export type GotoLobbyMessage = BaseDataMessage<MESSAGE_TYPE.GOTO_LOBBY>
export type CharacterSelectedMessage = BaseDataMessage<MESSAGE_TYPE.CHARACTER_SELECTED, Parti>

export type DataMessage = PlayerMoveMessage | GotoLobbyMessage | CharacterSelectedMessage
