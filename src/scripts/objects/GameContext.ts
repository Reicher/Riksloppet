import { NetworkClient } from '../../networking/NetworkClient'
import { NetworkPlayersHandler } from '../../networking/NetworkPlayersHandler'
import { IPlayerIdentity } from '../../networking/types'

export interface IGameContext {
  type: 'Multiplayer' | 'SinglePlayer'
  player: IPlayerIdentity
}

export interface IMultiplayerContext extends IGameContext {
  type: 'Multiplayer'
  networkClient: NetworkClient
  playersHandler: NetworkPlayersHandler
}

export interface ISinglePlayerContext extends IGameContext {
  type: 'SinglePlayer'
}

export type GameContext = IMultiplayerContext | ISinglePlayerContext
