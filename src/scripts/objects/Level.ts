import Phaser, { Physics } from 'phaser'
import { MainScene } from '../scenes/MainScene'
import { Difficulty } from '../scenes/types'
import Statist from './Statist'

export class Level {
  scene: MainScene
  length: number
  difficulty: Difficulty
  statist: Physics.Arcade.Group
  hinder: Physics.Arcade.Group
  powerup: Physics.Arcade.Group

  next_hinder = 0
  next_statist_uppe = 0
  next_statist_nere = 0

  constructor(
    scene: MainScene,
    length: number,
    difficulty: Difficulty,
    statist: Physics.Arcade.Group,
    hinder: Physics.Arcade.Group,
    powerup: Physics.Arcade.Group
  ) {
    this.scene = scene
    this.length = length
    this.difficulty = difficulty
    this.statist = statist
    this.hinder = hinder
    this.powerup = powerup

    // Skapa Värld
    scene.physics.world.setBounds(0, 140, length + 100, scene.HEIGHT - 140)
    scene.physics.world.setBoundsCollision()

    // Bakground
    let himmel = scene.add.tileSprite(0, 0, length, scene.HEIGHT, 'himmel')
    himmel.setOrigin(0).setScrollFactor(0.6)

    let mark = scene.add.tileSprite(0, 0, length, scene.HEIGHT, 'gata')
    mark.setOrigin(0).setScrollFactor(1)

    // Förgrund
    let förgrund2 = scene.add.tileSprite(0, scene.HEIGHT - 100, scene.goal, scene.HEIGHT, 'förgrund2')
    förgrund2.setOrigin(0).setScrollFactor(1.5)
    förgrund2.depth = scene.WIDTH + 10

    let förgrund1 = scene.add.tileSprite(0, scene.HEIGHT - 100, length, scene.HEIGHT, 'förgrund1')
    förgrund1.setOrigin(0).setScrollFactor(2)
    förgrund1.depth = scene.WIDTH + 11

    // Skapa några start-statister (uppe och nere separat)
    let nästa_min = 60 // enhet oklar
    let nästa_max = 130
    for (let x = scene.WIDTH; x > 400; x -= Phaser.Math.Between(nästa_min, nästa_max)) {
      this.createStatist(x, 170)
    }
    for (let x = scene.WIDTH; x > 400; x -= Phaser.Math.Between(nästa_min, nästa_max)) {
      this.createStatist(x, this.scene.HEIGHT - 30)
    }
  }

  protected createHinder(x: number, y: number) {
    const hinder = this.hinder.create(x, y, 'bil_röd')

    hinder.setImmovable(true)
    hinder.setBodySize(170, 50)
    hinder.body.setOffset(0, 50)
    hinder.setOrigin(0, 0.5)
    hinder.depth = hinder.y

    return hinder
  }

  protected createPowerup(x: number, y: number): Physics.Arcade.Sprite | undefined {
    if (Phaser.Math.RND.frac() < 0.8) return undefined

    if (Phaser.Math.RND.frac() > 0.5) return this.powerup.create(x, y - 75, 'peng').setOrigin(0.5, 1)
    return this.powerup.create(x, y - 75, 'neddut').setOrigin(0.5, 1)
  }

  protected createStatist(
    x: number,
    y: number,
    pwr = this.createPowerup(x, y),
    frame = Phaser.Math.RND.pick(['åskådare_kille', 'åskådare_kille'])
  ) {
    let statist = new Statist(this.scene, x, y, frame, pwr)

    this.statist.add(statist, true) // Lägg till till scenens statistgrupp
    statist.setOrigin(0.5, 1)
    return statist
  }

  update(_time: any, _delta: any, horizon: number): void {
    if (horizon > this.next_hinder) {
      this.next_hinder = horizon + Phaser.Math.RND.between(200, 600)
      const hinderY = Phaser.Math.RND.between(this.scene.STREET_MIN_Y, this.scene.STREET_MAX_Y)
      this.createHinder(horizon, hinderY)
    }

    let nästa_min = 60 // enhet oklar
    let nästa_max = 130
    if (horizon > this.next_statist_uppe) {
      this.next_statist_uppe = horizon + Phaser.Math.Between(nästa_min, nästa_max)
      this.createStatist(horizon, 170)
    }

    if (horizon > this.next_statist_nere) {
      this.next_statist_nere = horizon + Phaser.Math.Between(nästa_min, nästa_max)
      this.createStatist(horizon, this.scene.HEIGHT - 30)
    }
  }
}
