import { collection, CollectionReference, DocumentData, DocumentReference } from 'firebase/firestore'
import { NetworkClient } from './NetworkClient'
import { ClientData } from './types'

//https://www.metered.ca/tools/openrelay/
// const servers: RTCConfiguration = {
//   iceServers: [
//     {
//       urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
//     }
//   ],
//   iceCandidatePoolSize: 10
// }
const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80'
    },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ]
}

export class PeerClient extends NetworkClient {
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
