export const enum MESSAGE_TYPE {
    PLAYER_MOVE = 0
}
export type BaseDataMessage = [from: string, type: MESSAGE_TYPE]
export type PlayerMoveMessage = [from: string, type: MESSAGE_TYPE, x: number, y: number]

export type DataMessage = PlayerMoveMessage
export const isDataMessage = (data: any): data is DataMessage => Array.isArray(data) && data.length >= 2