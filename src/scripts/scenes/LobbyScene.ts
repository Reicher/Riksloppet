import { MESSAGE_TYPE } from '../../networking/dataTypes'
import { HostClient } from '../../networking/HostClient'
import { NetworkClient } from '../../networking/NetworkClient'
import { NetworkPlayersHandler } from '../../networking/NetworkPlayersHandler'
import { SlaveClient } from '../../networking/SlaveClient'
import { IPlayerIdentity } from '../../networking/types'
import { IMultiplayerContext } from '../objects/GameContext'
import { Button } from '../UI/Button'
import { COLOR } from '../UI/constants'
import { Group } from '../UI/Group'
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
    this.clientsGroup.addElement(new Text(context.player.clientName, 'normal'))

    context.playersHandler.getConnectedPlayers().forEach(this.addPlayer.bind(this))
    context.playersHandler!.onNewPlayer = this.addPlayer.bind(this)

    if (this.context.networkClient?.isHost) {
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

    this.context.networkClient?.on('game-data', message => {
      if (message.type === MESSAGE_TYPE.START_GAME) {
        this.scene.start('MainScene', this.context)
      }
    })
  }

  private addPlayer(player: IPlayerIdentity) {
    this.clientsGroup.addElement(new Text(player.clientName, 'normal'))
  }
}
