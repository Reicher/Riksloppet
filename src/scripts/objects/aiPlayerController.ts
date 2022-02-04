import Phaser from 'phaser'
import type { Dir } from '../../../typings/custom'
import { PARTI_LEDAMOT } from '../scenes/constants'
import { PlayerActor } from './PlayerActor'

export class AIPlayerController extends PlayerActor {
  dir: Dir
  aiAction: number

  constructor(scene, x: number, y: number, key: PARTI_LEDAMOT) {
    super(scene, x, y, key)
  }

  aiControl(time, delta): Dir {
    // Time to take action!
    if (this.aiAction <= 0) {
      this.dir = [1, Phaser.Math.Between(-100, 100) / 100] as Dir
      this.aiAction = Phaser.Math.Between(0.3, 1)
    }

    return this.dir
  }

  update(time: any, delta: any): void {
    let dir: Dir = [0, 0]

    if (this.knocked_out > 0) {
      this.knocked_out -= delta / 1000
    } else {
      dir = this.aiControl(time, delta)
    }

    super.update(time, delta, dir)
  }
}
