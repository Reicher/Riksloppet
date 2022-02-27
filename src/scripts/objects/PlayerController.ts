import Phaser, { Scene } from 'phaser'
import type { Dir } from '../../../typings/custom'
import { PARTI_LEDAMOT } from '../scenes/constants'
import { PlayerActor } from './PlayerActor'

const MOUSE_THRESHOLD = 0.5

export class PlayerController extends PlayerActor {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys

  constructor(
    scene: Scene,
    x: number,
    y: number,
    key: PARTI_LEDAMOT,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    clientName: string = key
  ) {
    super(scene, x, y, key, clientName)
    this.setInteractive()
    this.cursors = cursors
  }

  public playerControl(time, delta) {
    let dir: Dir = [0, 0]
    if (this.cursors.left.isDown) dir[0] = -1
    else if (this.cursors.right.isDown) dir[0] = 1

    if (this.cursors.up.isDown) dir[1] = -1
    else if (this.cursors.down.isDown) dir[1] = 1

    let mus_finger = this.scene.input.activePointer

    if (mus_finger.primaryDown) {
      dir[0] = mus_finger.worldX < this.x - MOUSE_THRESHOLD ? -1 : mus_finger.worldX > this.x + MOUSE_THRESHOLD ? 1 : 0
      dir[1] = mus_finger.worldY < this.y - MOUSE_THRESHOLD ? -1 : mus_finger.worldY > this.y + MOUSE_THRESHOLD ? 1 : 0
    }
    return dir
  }

  update(time: any, delta: any): void {
    this.dir = this.playerControl(time, delta)
    super.update(time, delta)
  }
}
