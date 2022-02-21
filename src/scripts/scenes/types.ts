import { PlayerController } from '../objects/PlayerController'

export interface IMultiplayerController {
  playerMoved(actir: PlayerController): void
}

export type Difficulty = number
