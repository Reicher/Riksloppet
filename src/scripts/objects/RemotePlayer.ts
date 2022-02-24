import { Dir } from '../../../typings/custom'
import { NetworkPlayersHandler } from '../../networking/NetworkPlayersHandler'
import { IPlayerIdentity } from '../../networking/types'
import { getLedamotForParti } from '../scenes/constants'
import { AIPlayerController } from './AIPlayerController'
import { PlayerActor } from './PlayerActor'

export class RemotePlayer extends PlayerActor {
  clientId: string

  constructor(scene: Phaser.Scene, client: IPlayerIdentity, networkHandler: NetworkPlayersHandler) {
    super(scene, 0, 0, getLedamotForParti(client.parti!), client.clientName)
    networkHandler.onRemotePlayerMove(client.clientId, this.playerMoved.bind(this))
    this.clientId = client.clientId
  }

  private playerMoved(x: number, y: number) {
    this.dir[0] = x
    this.dir[1] = y
  }

  update(time: any, delta: any): void {
    super.update(time, delta)
  }
}
