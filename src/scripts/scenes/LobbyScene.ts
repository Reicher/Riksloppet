import { NetworkClient } from '../../networking/NetworkClient'
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
  networkClient: NetworkClient

  constructor() {
    super({
      key: 'LobbyScene'
    })
  }

  create() {
    this.createPreLobby()
    this.networkClient = new NetworkClient()
  }

  createPreLobby() {
    UIHandler.clear()
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
    this.networkClient.addListener('room-created', roomId => {
      this.roomId = roomId
      this.createLobby()
    })

    this.networkClient.createRoom(this.clientName)
  }

  joinLobby() {
    this.networkClient.addListener('joined-room', () => {
      this.createLobby()
    })

    this.networkClient.joinRoom(this.clientName, this.roomId)
  }

  createLobby() {
    UIHandler.clear()

    this.networkClient.addListener('client-connected', ({ clientName }) => {
      group.addElement(new Text(clientName, 'normal'))
    })

    const group = new Group()
    group.addElement(new Text(`Lobby ${this.roomId}`, 'heading'))
    group.setPosition({ fromCenter: true })

    UIHandler.addElement(group)
  }
}
