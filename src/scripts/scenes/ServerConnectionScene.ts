import { HostClient } from '../../networking/HostClient'
import { NetworkPlayersHandler } from '../../networking/NetworkPlayersHandler'
import { SlaveClient } from '../../networking/SlaveClient'
import { IMultiplayerContext } from '../objects/GameContext'
import { Button } from '../UI/Button'
import { COLOR } from '../UI/constants'
import { Group } from '../UI/Group'
import { Textbox } from '../UI/Textbox'
import { UIHandler } from '../UI/UIHandler'

export class ServerConnectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ServerConnectionScene' })
  }

  create() {
    UIHandler.clearScreen()
    const group = new Group()
    const clientNameInput = new Textbox('Användarnamn', COLOR.GREEN)
    const roomIdInput = new Textbox('Rumsid', COLOR.GREEN)

    const createRoomButton = new Button('Skapa spel', COLOR.LIGHT_BLUE)
    createRoomButton.onClick(() => {
      const clientName = clientNameInput.getValue()
      if (clientName) {
        const client = new HostClient(clientName)
        const gameContext: IMultiplayerContext = {
          type: 'Multiplayer',
          player: {
            clientId: client.clientId,
            clientName: client.clientName,
            isHost: true
          },
          networkClient: client,
          playersHandler: new NetworkPlayersHandler(client)
        }

        client.once('room-created', () => {
          this.scene.start('CharSelectScene', gameContext)
        })

        client.connect()
      }
    })

    const joinRoomButton = new Button('Gå med i spel', COLOR.RED)
    joinRoomButton.onClick(() => {
      const clientName = clientNameInput.getValue()
      const roomId = roomIdInput.getValue()

      if (clientName && roomId) {
        const client = new SlaveClient(roomId, clientName)
        const gameContext: IMultiplayerContext = {
          type: 'Multiplayer',
          player: {
            clientId: client.clientId,
            clientName: client.clientName,
            isHost: false
          },
          networkClient: client,
          playersHandler: new NetworkPlayersHandler(client)
        }

        client.once('joined-room', () => {
          this.scene.start('CharSelectScene', gameContext)
        })

        client.connect()
      }
    })

    group.setPosition({
      fromCenter: true
    })

    group.addElement(clientNameInput, roomIdInput, createRoomButton, joinRoomButton)

    UIHandler.addElement(group)
  }
}
