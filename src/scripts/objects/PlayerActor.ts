import { PARTI_LEDAMOT } from '../scenes/constants'
import Partiledare from './partiLedare'

export class PlayerActor extends Partiledare {
  clientName: string

  constructor(scene, x: number, y: number, key: PARTI_LEDAMOT) {
    super(scene, x, y, key)
  }
}
