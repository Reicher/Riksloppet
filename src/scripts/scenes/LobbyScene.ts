import { DataMessage, MESSAGE_TYPE } from '../../networking/dataTypes'
import { IPlayerIdentity } from '../../networking/types'
import { IMultiplayerContext } from '../objects/GameContext'
import { Button } from '../UI/Button'
import { COLOR } from '../UI/constants'
import { Group } from '../UI/Group'
import { Image } from '../UI/Image'
import { getPortättImageSource } from '../UI/PortättImage'
import { Text } from '../UI/Text'
import { UIHandler } from '../UI/UIHandler'

const enum LOBBY_STATE {
  PRE_LOBBY,
  WAIT_FOR_PLAYERS
}

export class LobbyScene extends Phaser.Scene {
  state: LOBBY_STATE
  clientName: string
  roomId: string
  context: IMultiplayerContext

  clientsGroup: Group

  constructor() {
    super({
      key: 'LobbyScene'
    })
  }

  create(context: IMultiplayerContext) {
    this.context = context
    this.clientsGroup = new Group()

    context.playersHandler.getConnectedPlayers(false).forEach(this.addPlayer.bind(this))
    context.playersHandler.onNewPlayer = this.addPlayer.bind(this)

    if (this.context.networkClient.isHost) {
      this.createHostedLobby()
    } else {
      this.joinLobby()
    }
  }

  createHostedLobby() {
    UIHandler.clearScreen()
    const group = new Group()

    UIHandler.addElement(group)

    group.setPosition({ fromCenter: true })

    const lobbyHeader = new Text(`${this.context.player.clientName}'s Lobby`, 'heading')
    const lobbySubHeader = new Text(this.context.networkClient?.roomId!, 'heading')
    const divider = new Text('---------------------------------------------------', 'normal')

    const startGameButton = new Button('Starta spelet', COLOR.GREEN)
    startGameButton.onClick(() => {
      // Start the game
      this.context.networkClient?.sendData({
        type: MESSAGE_TYPE.START_GAME,
        payload: []
      })
      this.scene.start('MainScene', this.context)
    })

    group.addElement(lobbyHeader, lobbySubHeader, divider, this.clientsGroup, startGameButton)
  }

  joinLobby() {
    UIHandler.clearScreen()
    const group = new Group()
    UIHandler.addElement(group)

    group.setPosition({ fromCenter: true })

    const lobbyHeader = new Text(`Lobby`, 'heading')
    const lobbySubHeader = new Text(this.context.networkClient?.roomId!, 'heading')
    const divider = new Text('---------------------------------------------------', 'normal')

    group.addElement(lobbyHeader, lobbySubHeader, divider, this.clientsGroup)

    const onGameData = (message: DataMessage) => {
      if (message.type === MESSAGE_TYPE.START_GAME) {
        this.scene.start('MainScene', this.context)
        this.context.networkClient.off('game-data', onGameData)
      }
    }
    this.context.networkClient.on('game-data', onGameData)
  }

  private addPlayer(player: IPlayerIdentity) {
    const playerGroup = new Group(true)
    const portätt = new Image({
      width: 150,
      height: 150,
      sizing: 'contain',
      source: getPortättImageSource(player.parti!)
    })
    const playerName = new Text(player.clientName, 'normal')

    playerGroup.addElement(portätt, playerName)
    this.clientsGroup.addElement(playerGroup)
  }
}
