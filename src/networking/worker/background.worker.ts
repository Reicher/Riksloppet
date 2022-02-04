/* eslint-disable no-restricted-globals */
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { roomCreatedMessage, Message, MESSAGE_TYPE, clientConnectedMessage, joinedRoomMessage } from '../messageTypes'
import { createRemoteConnection } from './createRemoteConnection'
import { firebase } from './firebase'
import { joinRoom } from './joinRoom'
import { createDataMessageOchestrator } from './messages'

const messageOchestrator = createDataMessageOchestrator()

const createRoom = () => {
  messageOchestrator.setAsHost()
  const roomDoc = doc(collection(firebase.db, 'rooms'))
  const roomClients = collection(roomDoc, 'clients')
  const roomId = roomDoc.id

  onSnapshot(roomClients, snapshot => {
    snapshot.docChanges().forEach(change => {
      // Someone joined the room, establish connection to it.
      if (change.type === 'added') {
        const clientDoc = change.doc.ref
        createRemoteConnection(clientDoc, messageOchestrator).then(clientDetails => {
          postMessage(clientConnectedMessage(clientDetails))
        })
      }
    })
  })

  return roomId
}

self.addEventListener('message', ({ data }) => {
  const message = data as Message
  switch (message.type) {
    case MESSAGE_TYPE.CREATE_ROOM:
      {
        const roomId = createRoom()
        postMessage(roomCreatedMessage(roomId))
      }
      break
    case MESSAGE_TYPE.JOIN_ROOM:
      {
        const { roomId, clientName, clientId } = message.data
        joinRoom(roomId, clientName, clientId, messageOchestrator).then(() => {
          postMessage(joinedRoomMessage(undefined))
        })
      }
      break
    default:
      break
  }
})
