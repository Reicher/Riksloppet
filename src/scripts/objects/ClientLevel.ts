import { Physics } from 'phaser'
import {
  CreateHinderPayload,
  CreateStatistPayload,
  DataMessage,
  GAME_OBJECT_TYPE,
  MESSAGE_TYPE
} from '../../networking/messageTypes'
import { NetworkClient } from '../../networking/NetworkClient'
import { MainScene } from '../scenes/MainScene'
import { Difficulty } from '../scenes/types'
import { Level } from './Level'

export class ClientLevel extends Level {
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
    this.networkClient.addListener('game-data', this.onGameData.bind(this))
  }

  private onGameData(message: DataMessage) {
    if (message.type === MESSAGE_TYPE.CREATE_GAME_OBJECT) {
      switch (message.payload.type) {
        case GAME_OBJECT_TYPE.HINDER:
          this.spawnHinder(message.payload.data)
          break
        case GAME_OBJECT_TYPE.STATIST:
          this.spawnStatist(message.payload.data)
          break
        default:
          break
      }
    }
  }

  private spawnHinder({ x, y }: CreateHinderPayload['data']) {
    this.createHinder(x, y)
  }

  private spawnStatist({ pX, pY, sX, sY, frame }: CreateStatistPayload['data']) {
    const power = pX && pY ? this.powerup.create(pX, pY, 'peng') : undefined

    this.createStatist(sX, sY, power, frame)
  }

  update(_time: any, _delta: any, _horizon: number): void {
    // Override here since we only spawn entities from the host client.
  }
}
