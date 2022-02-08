import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  setDoc
} from 'firebase/firestore'
import { firebase } from './firebase'
import { MessageOchestrator } from './MessageOchestrator'
import { NetworkClient } from './NetworkClient'
import { PeerClient } from './PeerClient'

class SubClient extends PeerClient {
  constructor(clientDoc: DocumentReference<DocumentData>, ochestrator: MessageOchestrator) {
    super(clientDoc, ochestrator)
  }

  protected initialize(): void {
    this.connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        addDoc(this.offerCandidates, candidate.toJSON())
      }
    }

    this.connection.onconnectionstatechange = async () => {
      if (this.connection.connectionState === 'connected') {
        console.log(`Remote client "${this.clientDoc.id}" successfully connected!`)
        const clientData = (await getDoc(this.clientDoc)).data()
        if (clientData?.clientName === undefined) return

        this.isConnected = true
        this.emit('client-connected', {
          clientName: clientData.clientName,
          clientId: this.clientDoc.id
        })
      }
    }

    this.ochestrator.addConnection(this.connection)
  }

  public async connect(): Promise<void> {
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
  private subclients: SubClient[]
  constructor(_clientName: string) {
    super()
    this.clientName = _clientName
    this.subclients = []

    this.initialize()
  }

  protected initialize(): void {
    this.isHost = true
    this.ochestrator.setAsHost()
  }

  public connect() {
    const roomDoc = doc(collection(firebase.db, 'rooms'))
    const roomClients = collection(roomDoc, 'clients')
    this.roomId = roomDoc.id
    this.isConnected = true
    this.emit('room-created', this.roomId)

    onSnapshot(roomClients, snapshot => {
      snapshot.docChanges().forEach(change => {
        // Someone joined the room, establish connection to it.
        if (change.type === 'added') {
          const clientDoc = change.doc.ref
          this.createSubClient(clientDoc)
        }
      })
    })
  }

  private createSubClient(clientDoc: DocumentReference<DocumentData>) {
    const subClient = new SubClient(clientDoc, this.ochestrator)
    subClient.addListener('client-connected', identity => {
      this.emit('client-connected', identity)
    })

    this.subclients.push(subClient)
  }
}
