import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import { firebase } from './firebase'
import { v4 as uuid } from 'uuid'
import { PeerClient } from './PeerClient'
import { ClientData, IClientIdentity, RoomData } from './types'
import { NetworkClient } from './NetworkClient'

// Used by clients who joins an exisitng room.
export class SlaveClient extends PeerClient {
  clientsDoc: CollectionReference<ClientData>
  roomDoc: DocumentReference<RoomData>

  private connectedClients: IClientIdentity[]

  constructor(_roomId: string, _clientName: string) {
    const roomDoc = doc(collection(firebase.db, 'rooms'), _roomId) as DocumentReference<RoomData>
    const clients = collection(roomDoc, 'clients') as CollectionReference<ClientData>
    const clientDoc = doc(clients, uuid())

    super(_clientName, clientDoc)

    this.clientsDoc = clients
    this.roomDoc = roomDoc
    this.isHost = false
    this.connectedClients = []
    this.setupListeners()

    NetworkClient.instance = this
  }

  private setupListeners() {
    this.connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        addDoc(this.answerCandidates, candidate.toJSON())
      }
    }

    this.connection.onconnectionstatechange = () => {
      if (this.connection.connectionState === 'connected') {
        console.log(`Client ${this.clientId} connected to host`)
        this.isConnected = true
        this.setupConnectedListeners()
        this.emit('joined-room')
      }
      // ToDo: Implement client disconnect
    }
    this.addConnection(this.connection, this.clientId)
  }

  private setupConnectedListeners() {
    getDoc(this.roomDoc).then(snapshot => {
      const roomData = snapshot.data()
      if (roomData) {
        const clientIdentity = {
          clientId: roomData.hostId,
          clientName: roomData.hostName,
          isHost: true
        }

        this.emit('client-connected', clientIdentity)
        this.connectedClients.push(clientIdentity)
      }
    })
    onSnapshot(this.clientsDoc, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added' && change.doc.id !== this.clientId) {
          const { clientName } = change.doc.data()

          if (!clientName) return

          const clientIdentity = {
            clientId: change.doc.id,
            clientName,
            isHost: false
          }

          this.connectedClients.push(clientIdentity)
          this.emit('client-connected', clientIdentity)
        }
      })
    })
  }

  public getConnectedClients() {
    return this.connectedClients
  }

  public async connect() {
    console.log(`Connecting client ${this.clientId} to host`)
    await setDoc(this.clientDoc, {
      clientName: this.clientName
    })

    onSnapshot(this.clientDoc, async snapshot => {
      const clientData = snapshot.data()
      if (!clientData) return
      if (!clientData.offer) return
      if (clientData.answer) return

      console.log(`Client ${this.clientId} found host`)

      const offerDescription = new RTCSessionDescription(clientData.offer)
      await this.connection.setRemoteDescription(offerDescription)

      const answerDescription = await this.connection.createAnswer()
      await this.connection.setLocalDescription(answerDescription)

      await updateDoc(this.clientDoc, {
        answer: { sdp: answerDescription.sdp, type: answerDescription.type },
        clientName: this.clientName
      })
    })

    onSnapshot(this.offerCandidates, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log(`Client ${this.clientId} found offer candidate`)
          const candidate = new RTCIceCandidate(change.doc.data())
          this.connection.addIceCandidate(candidate)
        }
      })
    })
  }
}
