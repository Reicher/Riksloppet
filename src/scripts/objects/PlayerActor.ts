import { PARTI_LEDAMOT } from '../scenes/constants'
import Partiledare from './PartiLedare'

export class PlayerActor extends Partiledare {
  clientName: string

  constructor(scene: Phaser.Scene, x: number, y: number, key: PARTI_LEDAMOT) {
    super(scene, x, y, key)
  }
}
