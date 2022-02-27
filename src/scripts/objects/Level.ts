import Phaser, { GameObjects, Physics } from 'phaser'
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

  protected createHinder(x: number, y: number) {
    const hinder = this.hinder.create(x, y, 'bil_röd')

    hinder.setImmovable(true)
    hinder.setBodySize(170, 50)
    hinder.body.setOffset(0, 50)
    hinder.setOrigin(0, 0.5)
    hinder.depth = hinder.y

    return hinder
  }

  protected createStatist(
    x: number,
    y: number,
    pwr: Physics.Arcade.Sprite,
    frame = Phaser.Math.RND.pick(['åskådare_kille', 'åskådare_kille'])
  ) {
    let statist = new Statist(this.scene, x, y, frame, pwr)
    this.statist.add(statist, true)

    statist.setOrigin(0, 0.5)

    return statist
  }

  update(_time: any, _delta: any, horizon: number): void {
    if (horizon > this.next_hinder) {
      this.next_hinder = horizon + Phaser.Math.RND.between(200, 600)
      const hinderY = Phaser.Math.RND.between(this.scene.STREET_MIN_Y, this.scene.STREET_MAX_Y)
      this.createHinder(horizon, hinderY)
    }

    if (horizon > this.next_statist_uppe) {
      this.next_statist_uppe = horizon + Phaser.Math.RND.between(40, 100)
      let pwr = this.powerup.create(horizon + 20, 100, 'peng')
      this.createStatist(horizon, 130, pwr)
    }

    if (horizon > this.next_statist_nere) {
      this.next_statist_nere = horizon + Phaser.Math.RND.between(40, 100)
      let pwr = this.powerup.create(horizon + 20, this.scene.HEIGHT - 155, 'peng')
      this.createStatist(horizon, this.scene.HEIGHT - 90, pwr)
    }
  }
}
