import { MESSAGE_TYPE } from '../../networking/dataTypes'
import { HostClient } from '../../networking/HostClient'
import { NetworkClientEmitter } from '../../networking/NetworkClient'
import { SlaveClient } from '../../networking/SlaveClient'
import { Button } from '../UI/Button'
import { COLOR } from '../UI/constants'
import { Group } from '../UI/Group'
import { Text } from '../UI/Text'
import { Textbox } from '../UI/Textbox'
import { UIHandler } from '../UI/UIHandler'

const enum LOBBY_STATE {
  PRE_LOBBY,
  WAIT_FOR_PLAYERS
}

export class LobbyScene extends Phaser.Scene {
  state: LOBBY_STATE
  clientName: string
  roomId: string
  networkClient: NetworkClientEmitter

  constructor() {
    super({
      key: 'LobbyScene'
    })
  }

  create() {
    this.createPreLobby()
  }

  createPreLobby() {
    UIHandler.clearScreen()
    const group = new Group()
    const clientNameInput = new Textbox('Användarnamn', COLOR.GREEN)
    const roomIdInput = new Textbox('Rumsid', COLOR.GREEN)

    const createRoomButton = new Button('Skapa spel', COLOR.LIGHT_BLUE)
    createRoomButton.onClick(() => {
      this.clientName = clientNameInput.getValue()
      if (this.clientName) {
        this.createHostedLobby()
      }
    })

    const joinRoomButton = new Button('Gå med i spel', COLOR.RED)
    joinRoomButton.onClick(() => {
      this.clientName = clientNameInput.getValue()
      this.roomId = roomIdInput.getValue()

      if (this.clientName && this.roomId) {
        this.joinLobby()
      }
    })

    group.setPosition({
      fromCenter: true
    })

    group.addElement(clientNameInput, roomIdInput, createRoomButton, joinRoomButton)

    UIHandler.addElement(group)
  }

  createHostedLobby() {
    UIHandler.clearScreen()
    const group = new Group()
    const clientsGroup = new Group()

    UIHandler.addElement(group)

    group.setPosition({ fromCenter: true })

    const lobbyHeader = new Text(`Creating lobby...`, 'heading')

    const lobbySubHeader = new Text(``, 'heading')

    const divider = new Text('---------------------------------------------------', 'normal')

    const startGameButton = new Button('Starta spelet', COLOR.GREEN)
    startGameButton.onClick(() => {
      // Tell clients to go to CharacterSelect
      this.networkClient.sendData({
        type: MESSAGE_TYPE.GOTO_LOBBY,
        payload: []
      })
      this.scene.start('CharSelectScene', 'MultiplayerScene' as any)
    })
    startGameButton.hide()

    group.addElement(lobbyHeader, lobbySubHeader, divider, clientsGroup, startGameButton)

    clientsGroup.addElement(new Text(this.clientName, 'normal'))

    this.networkClient = new HostClient(this.clientName)
    this.networkClient.addListener('room-created', roomId => {
      this.roomId = roomId
      lobbyHeader.setText(`${this.clientName}'s Lobby`)
      lobbySubHeader.setText(roomId)
      startGameButton.show()
    })

    this.networkClient.addListener('client-connected', ({ clientName }) => {
      clientsGroup.addElement(new Text(clientName, 'normal'))
    })

    this.networkClient.connect()
  }

  joinLobby() {
    UIHandler.clearScreen()
    const group = new Group()
    const clientsGroup = new Group()

    UIHandler.addElement(group)

    group.setPosition({ fromCenter: true })

    const lobbyHeader = new Text(`Lobby`, 'heading')
    const lobbySubHeader = new Text(`Joining room...`, 'heading')
    const divider = new Text('---------------------------------------------------', 'normal')

    clientsGroup.addElement(new Text(this.clientName, 'normal'))

    group.addElement(lobbyHeader, lobbySubHeader, divider, clientsGroup)

    this.networkClient = new SlaveClient(this.roomId, this.clientName)
    this.networkClient.addListener('joined-room', () => {
      lobbySubHeader.setText(this.roomId)
    })

    this.networkClient.addListener('client-connected', ({ clientName }) => {
      clientsGroup.addElement(new Text(clientName, 'normal'))
    })

    this.networkClient.addListener('game-data', data => {
      switch (data.type) {
        case MESSAGE_TYPE.GOTO_LOBBY:
          this.scene.start('CharSelectScene', 'MultiplayerScene' as any)
          break
        default:
          break
      }
    })

    this.networkClient.connect()
  }
}
