import Phaser, { Scene } from 'phaser'
import type { Dir } from '../../../typings/custom'
import { PARTI_LEDAMOT } from '../scenes/constants'
import { IMultiplayerController } from '../scenes/types'
import { PlayerActor } from './PlayerActor'

export class PlayerController extends PlayerActor {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  multiplayerController: IMultiplayerController

  constructor(
    scene: Scene,
    controller: IMultiplayerController,
    x: number,
    y: number,
    key: PARTI_LEDAMOT,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
  ) {
    super(scene, x, y, key)
    this.multiplayerController = controller
    this.cursors = cursors
  }

  public playerControl(time, delta) {
    let dir: Dir = [0, 0]
    if (this.cursors.left.isDown) dir[0] = -1
    else if (this.cursors.right.isDown) dir[0] = 1

    if (this.cursors.up.isDown) dir[1] = -1
    else if (this.cursors.down.isDown) dir[1] = 1

    let mus_finger = this.scene.input.activePointer

    if (mus_finger.isDown) {
      dir[0] = mus_finger.x - this.x + this.scene.cameras.main.scrollX
      dir[1] = mus_finger.y - this.y
    }
    return dir
  }

  update(time: any, delta: any): void {
    const xPrev = this.x
    const yPrev = this.y

    const dir = this.playerControl(time, delta)
    super.update(time, delta, dir)

    const didMove = xPrev !== this.x || yPrev !== this.y
    if (didMove) {
      this.multiplayerController.playerMoved(this)
    }
  }
}
