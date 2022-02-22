import { Dir } from '../../../typings/custom'
import { getColorForParti, getLedamotForParti, getPartiForLedamot, PARTI_LEDAMOT } from '../scenes/constants'
import Partiledare from './PartiLedare'

export class PlayerActor extends Partiledare {
  clientName: string
  protected dir: Dir
  private textLabel: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, x: number, y: number, key: PARTI_LEDAMOT, clientName: string) {
    super(scene, x, y, key)

    this.clientName = clientName
    this.dir = [0, 0]

    this.textLabel = scene.add.text(x, y, clientName, {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: '12px',
      align: 'center',
      strokeThickness: 4,
      stroke: getColorForParti(getPartiForLedamot(key))
    })
  }

  update(time: any, delta: any): void {
    if (this.knocked_out > 0) {
      this.knocked_out -= delta / 1000
      this.dir = [0, 0]
    }

    super.update(time, delta, this.dir)

    this.textLabel.setPosition(
      this.x - this.textLabel.width / 2,
      this.y - this.getBounds().height / 2 - this.textLabel.height - 5
    )
  }
}
