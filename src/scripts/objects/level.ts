import Phaser, { Scene, Physics } from 'phaser'
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
  }

  public createHinder(pos) {
    let hinder = this.hinder.create(
      pos,
      Phaser.Math.Between(this.scene.STREET_MIN_Y, this.scene.STREET_MAX_Y),
      'bil_röd'
    )

    hinder.setImmovable(true)
    hinder.setBodySize(170, 50)
    hinder.body.setOffset(0, 50)
    hinder.setOrigin(0, 0.5)
    hinder.depth = hinder.y
  }

  public createStatist(x, y) {
    let frame = Phaser.Math.RND.pick(['åskådare_kille', 'åskådare_kille']) // fler senare

    // Kanske meningen att skapa en Statist per powerup?
    // Just nu skickar vi med hela gruppen
    let statist = new Statist(this.scene, x, y, frame, this.powerup)
    this.statist.add(statist, true)

    statist.setOrigin(0, 0.5)
  }

  update(time: any, delta: any, horizon: number): void {
    // ToDo: Needs to changed to be determenistic in multiplayer.
    // Look into seeding?
    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/random-data-generator/

    if (horizon > this.next_hinder) {
      this.next_hinder = horizon + Phaser.Math.Between(200, 600)
      this.createHinder(horizon)
    }

    if (horizon > this.next_statist_uppe) {
      this.next_statist_uppe = horizon + Phaser.Math.Between(40, 100)
      this.createStatist(horizon, 130)
    }

    if (horizon > this.next_statist_nere) {
      this.next_statist_nere = horizon + Phaser.Math.Between(40, 100)
      this.createStatist(horizon, this.scene.HEIGHT - 70)
    }
  }
}
