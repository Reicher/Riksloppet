import { addDoc, collection, CollectionReference, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { firebase } from './firebase'
import { NetworkClient } from './NetworkClient'
import { PeerClient } from './PeerClient'
import { ClientData } from './types'

export class SlaveClient extends PeerClient {
  constructor(_roomId: string, _clientName: string) {
    const roomDoc = doc(collection(firebase.db, 'rooms'), _roomId)
    const clients = collection(roomDoc, 'clients') as CollectionReference<ClientData>
    const clientDoc = doc(clients, NetworkClient.CLIENT_ID)

    super(clientDoc)

    this.roomId = _roomId
    this.clientName = _clientName
    this.isHost = false
  }

  protected initialize() {
    this.connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        addDoc(this.answerCandidates, candidate.toJSON())
      }
    }

    this.connection.onconnectionstatechange = () => {
      if (this.connection.connectionState === 'connected') {
        this.isConnected = true
        this.emit('joined-room')
      }
      // ToDo: Implement client disconnect
    }
    this.ochestrator.addConnection(this.connection)
  }

  public async connect() {
    await setDoc(this.clientDoc, {
      clientName: this.clientName
    })

    onSnapshot(this.clientDoc, async snapshot => {
      const clientData = snapshot.data()
      if (!clientData) return
      if (!clientData.offer) return
      if (clientData.answer) return

      const offerDescription = new RTCSessionDescription(clientData.offer)
      await this.connection.setRemoteDescription(offerDescription)

      const answerDescription = await this.connection.createAnswer()
      await this.connection.setLocalDescription(answerDescription)

      await updateDoc(this.clientDoc, { answer: { sdp: answerDescription.sdp, type: answerDescription.type } })
    })

    onSnapshot(this.offerCandidates, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          this.connection.addIceCandidate(candidate)
        }
      })
    })
  }
}
