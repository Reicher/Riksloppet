import { Dir } from '../../../typings/custom'
import { NetworkPlayersHandler } from '../../networking/NetworkPlayersHandler'
import { IPlayerIdentity } from '../../networking/types'
import { getLedamotForParti } from '../scenes/constants'
import { PlayerActor } from './PlayerActor'

export class RemotePlayer extends PlayerActor {
  clientId: string
  static MAX_LERP_TIME = 50

  private newPosition: Phaser.Math.Vector2
  private currentPosition: Phaser.Math.Vector2
  private lerpTime: number

  constructor(scene: Phaser.Scene, client: IPlayerIdentity, networkHandler: NetworkPlayersHandler) {
    super(scene, 0, 0, getLedamotForParti(client.parti!), client.clientName)
    networkHandler.onRemotePlayerMove(client.clientId, this.playerMoved.bind(this))

    this.clientId = client.clientId
    this.newPosition = new Phaser.Math.Vector2(this.x, this.y)
    this.currentPosition = new Phaser.Math.Vector2(this.x, this.y)
    this.lerpTime = 0
  }

  private playerMoved(_dirX: number, _dirY: number, posX: number, posY: number) {
    this.newPosition.x = posX
    this.newPosition.y = posY
    this.lerpTime = 0
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    if (this.lerpTime < 1 && this.lerpTime >= 0) {
      this.anims.play('spring', true)
    } else if (this.anims.currentAnim && this.anims.currentAnim.key !== 'stopp') {
      this.anims.play('stopp', true)
    }

    this.currentPosition.x = this.x
    this.currentPosition.y = this.y
  }

  update(_time: any, delta: any): void {
    this.lerpTime = Phaser.Math.Clamp(this.lerpTime + delta / RemotePlayer.MAX_LERP_TIME, 0, 1)
    const direction = this.currentPosition.clone().subtract(this.newPosition)
    const moveTo = this.currentPosition.clone().lerp(this.newPosition, this.lerpTime)

    if (direction.x <= 0) {
      this.setFlipX(false)
    } else {
      this.setFlipX(true)
    }

    this.setPosition(moveTo.x, moveTo.y)
    this.updateTextLabelPosition()
  }
}
