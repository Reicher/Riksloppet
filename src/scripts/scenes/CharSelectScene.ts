import { Button } from '../UI/Button'
import { COLOR } from '../UI/constants'
import { Grid } from '../UI/Grid'
import { Group } from '../UI/Group'
import { PortättImage } from '../UI/PortättImage'
import { Text } from '../UI/Text'
import { UIHandler } from '../UI/UIHandler'
import { Parti } from './constants'

export default class CharSelectScene extends Phaser.Scene {
  cursors
  characters
  partinamn: Parti[] = ['kd', 'c', 'v', 'sd']
  selectedPortätt: PortättImage
  mainSceneKey: string
  constructor() {
    super({ key: 'CharSelectScene' })
    this.characters = []
  }

  init(_mainSceneKey: string) {
    this.mainSceneKey = _mainSceneKey
  }

  addPorträtt() {
    UIHandler.clearScreen()

    const rows = 2
    const columns = 4
    const partiCount = rows * columns

    const group = new Group()
    group.setPosition({ fromCenter: true })

    const porträttGrid = new Grid(rows, columns)
    const väljButton = new Button('Välj', COLOR.GREEN)
    väljButton.onClick(() => {
      if (!this.selectedPortätt) {
        console.error('No selected parti!')
        return
      }
      this.scene.start(this.mainSceneKey, this.selectedPortätt.parti as any)
    })
    väljButton.hide()

    for (let i = 0; i < partiCount; i++) {
      const parti = this.partinamn[i % this.partinamn.length]
      const porträtt = new PortättImage(parti)
      porträtt.onClick(() => {
        if (this.selectedPortätt) this.selectedPortätt.setActive(false)

        this.selectedPortätt = porträtt
        porträtt.setActive(true)
        väljButton.show()
      })

      porträttGrid.addElement(porträtt)
    }

    group.addElement(new Text('Välj din löpare!', 'heading'), porträttGrid, väljButton)
    UIHandler.addElement(group)
  }

  create() {
    console.log('CharSelectScene')
    this.addPorträtt()
  }

  update() {}
}
