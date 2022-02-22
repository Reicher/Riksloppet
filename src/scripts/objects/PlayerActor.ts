import { Dir } from '../../../typings/custom'
import { PARTI_LEDAMOT } from '../scenes/constants'
import Partiledare from './PartiLedare'

export class PlayerActor extends Partiledare {
  clientName: string
  protected dir: Dir

  constructor(scene: Phaser.Scene, x: number, y: number, key: PARTI_LEDAMOT) {
    super(scene, x, y, key)

    this.dir = [0, 0]
  }

  update(time: any, delta: any): void {
    if (this.knocked_out > 0) {
      this.knocked_out -= delta / 1000
      this.dir = [0, 0]
    }

    super.update(time, delta, this.dir)
  }
}
