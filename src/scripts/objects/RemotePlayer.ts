import { Dir } from '../../../typings/custom'
import { NetworkPlayersHandler } from '../../networking/NetworkPlayersHandler'
import { IPlayerIdentity } from '../../networking/types'
import { getLedamotForParti } from '../scenes/constants'
import { PlayerActor } from './PlayerActor'

export class RemotePlayer extends PlayerActor {
  private dir: Dir = [0, 0]
  constructor(scene: Phaser.Scene, client: IPlayerIdentity, networkHandler: NetworkPlayersHandler) {
    super(scene, 0, 0, getLedamotForParti(client.parti!))
    this.clientName = client.clientName
    networkHandler.onRemotePlayerMove(client.clientId, this.playerMoved.bind(this))
  }

  private playerMoved(x: number, y: number) {
    this.dir[0] = x
    this.dir[1] = y
  }

  update(time: any, delta: any, dir?: Dir): void {
    super.update(time, delta, this.dir)
  }
}
