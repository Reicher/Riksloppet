import { Level } from './Level'
import { Physics } from 'phaser'
import { NetworkClient } from '../../networking/NetworkClient'
import { MainScene } from '../scenes/MainScene'
import { Difficulty } from '../scenes/types'
import { CreateGameObjectMessagePayload, GAME_OBJECT_TYPE, MESSAGE_TYPE } from '../../networking/messageTypes'
import Statist from './Statist'

export class HostLevel extends Level {
  private networkClient: NetworkClient
  constructor(
    networkClient: NetworkClient,
    scene: MainScene,
    length: number,
    difficulty: Difficulty,
    statist: Physics.Arcade.Group,
    hinder: Physics.Arcade.Group,
    powerup: Physics.Arcade.Group
  ) {
    super(scene, length, difficulty, statist, hinder, powerup)
    this.networkClient = networkClient
  }

  private replicateGameObject(payload: CreateGameObjectMessagePayload) {
    this.networkClient.sendData({
      type: MESSAGE_TYPE.CREATE_GAME_OBJECT,
      payload
    })
  }

  protected createHinder(x: number, y: number): void {
    super.createHinder(x, y)
    this.replicateGameObject({
      type: GAME_OBJECT_TYPE.HINDER,
      data: {
        x,
        y
      }
    })
  }

  protected createStatist(x: number, y: number, pwr: Physics.Arcade.Sprite, frame?: string): Statist {
    const statist = super.createStatist(x, y, pwr, frame)

    this.replicateGameObject({
      type: GAME_OBJECT_TYPE.STATIST,
      data: {
        pX: pwr.x,
        pY: pwr.y,
        sX: x,
        sY: y,
        frame: statist.frame.name
      }
    })

    return statist
  }
}
