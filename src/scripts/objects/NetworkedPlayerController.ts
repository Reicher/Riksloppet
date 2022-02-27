import { Scene } from 'phaser'
import { NetworkPlayersHandler } from '../../networking/NetworkPlayersHandler'
import { PARTI_LEDAMOT } from '../scenes/constants'
import { PlayerController } from './PlayerController'

export class NetworkedPlayerController extends PlayerController {
  networkPlayerHandler: NetworkPlayersHandler

  constructor(
    scene: Scene,
    key: PARTI_LEDAMOT,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    clientName: string,
    networkPlayerHandler: NetworkPlayersHandler
  ) {
    super(scene, 0, 0, key, cursors, clientName)
    this.networkPlayerHandler = networkPlayerHandler
  }

  update(time: any, delta: any): void {
    super.update(time, delta)

    if (this.dir[0] !== 0 || this.dir[1] !== 0) {
      this.networkPlayerHandler.replicatePlayerMove(...this.dir, this.x, this.y)
    }
  }
}
