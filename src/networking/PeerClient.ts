import { collection, CollectionReference, DocumentData, DocumentReference } from 'firebase/firestore'
import { NetworkClientEmitter } from './NetworkClient'
import { ClientData } from './types'

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10
}

export class PeerClient extends NetworkClientEmitter {
  clientDoc: DocumentReference<ClientData>
  offerCandidates: CollectionReference<DocumentData>
  answerCandidates: CollectionReference<DocumentData>
  connection: RTCPeerConnection

  constructor(_clientName: string, _clientDoc: DocumentReference<ClientData>) {
    super(_clientDoc.id)

    this.clientName = _clientName
    this.clientDoc = _clientDoc
    this.connection = new RTCPeerConnection(servers)
    this.offerCandidates = collection(this.clientDoc, 'offerCandidates')
    this.answerCandidates = collection(this.clientDoc, 'answerCandidates')
  }

  connect(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
