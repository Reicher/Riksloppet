import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe
} from 'firebase/firestore'
import { firebase } from './firebase'
import { CLIENT_NAME_UNKNOWN } from './clientEvents'
import { NetworkClient } from './NetworkClient'
import { PeerClient } from './PeerClient'
import { RoomData } from './types'

class SubClient extends PeerClient {
  constructor(clientDoc: DocumentReference<DocumentData>) {
    super(CLIENT_NAME_UNKNOWN, clientDoc)

    this.setUpListeners()
  }

  private setUpListeners() {
    this.connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        addDoc(this.offerCandidates, candidate.toJSON())
      }
    }

    this.connection.oniceconnectionstatechange = async () => {
      if (this.connection.iceConnectionState === 'connected') {
        const clientData = (await getDoc(this.clientDoc)).data()
        console.log(`Peer connection established, data:`, clientData)
        if (clientData?.clientName === undefined) return

        this.clientName = clientData.clientName
        this.emit('client-connected', {
          clientName: clientData.clientName,
          clientId: this.clientId,
          isHost: false
        })
      } else if (this.connection.iceConnectionState === 'disconnected') {
        console.log(`Peer connection disconnected`, this)
        this.emit('client-disconnected', {
          clientName: this.clientName,
          clientId: this.clientId,
          isHost: false
        })
      }
    }
  }

  public async connect(): Promise<void> {
    console.log('Connecting to sub client ' + this.clientId)
    const offerDescription = await this.connection.createOffer()
    await this.connection.setLocalDescription(offerDescription)
    await setDoc(this.clientDoc, { offer: { sdp: offerDescription.sdp, type: offerDescription.type } })

    onSnapshot(this.clientDoc, async snapshot => {
      const data = snapshot.data()
      if (!this.connection.currentRemoteDescription && data?.answer) {
        console.log('Got an answer')
        const answerDescription = new RTCSessionDescription(data.answer)
        await this.connection.setRemoteDescription(answerDescription)
        console.log('Answer setup done')
      }
    })

    onSnapshot(this.answerCandidates, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          this.connection.addIceCandidate(candidate)
        }
      })
    })
  }
}

export class HostClient extends NetworkClient {
  private openForConnections: boolean
  private unsubscibeClients: Unsubscribe

  constructor(_clientName: string) {
    super()

    this.isHost = true
    this.isConnected = false
    this.clientName = _clientName
    this.openForConnections = true
  }

  public async connect() {
    console.log('Connecting host client')
    const roomDoc = doc(collection(firebase.db, 'rooms')) as DocumentReference<RoomData>
    const roomClients = collection(roomDoc, 'clients')

    await setDoc(roomDoc, {
      hostId: this.clientId,
      hostName: this.clientName
    })

    this.roomId = roomDoc.id
    this.isConnected = true
    this.emit('room-created', this.roomId)

    this.unsubscibeClients = onSnapshot(roomClients, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added' && this.openForConnections) {
          console.log('Client connected, setting up peer connection...')
          const clientDoc = change.doc.ref
          this.createSubClient(clientDoc)
        }
      })
    })
  }

  public lockRoom() {
    console.log('[HostClient] locked new connections')
    this.openForConnections = false
    this.unsubscibeClients()
  }

  private createSubClient(clientDoc: DocumentReference<DocumentData>) {
    const subClient = new SubClient(clientDoc)
    subClient.addListener('client-connected', identity => {
      this.emit('client-connected', identity)
    })
    subClient.addListener('client-disconnected', identity => {
      this.removeConnection(identity.clientId)
      this.emit('client-disconnected', identity)
    })
    this.addConnection(subClient.connection, subClient.clientId)

    subClient.connect()
  }
}
