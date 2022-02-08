import { EventEmitter } from 'eventemitter3'
import { collection, CollectionReference, DocumentData, DocumentReference } from 'firebase/firestore'
import { MessageOchestrator } from './MessageOchestrator'
import { NetworkClient } from './NetworkClient'
import { ClientData } from './types'

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10
}

export class PeerClient extends NetworkClient {
  clientDoc: DocumentReference<ClientData>
  offerCandidates: CollectionReference<DocumentData>
  answerCandidates: CollectionReference<DocumentData>
  connection: RTCPeerConnection

  constructor(_clientDoc: DocumentReference<ClientData>, ochestrator?: MessageOchestrator) {
    super(ochestrator)
    this.clientDoc = _clientDoc

    this.initialize()
  }

  protected initialize() {
    this.connection = new RTCPeerConnection(servers)
    this.offerCandidates = collection(this.clientDoc, 'offerCandidates')
    this.answerCandidates = collection(this.clientDoc, 'answerCandidates')
  }

  public async connect() {
    return Promise.resolve()
  }
}
