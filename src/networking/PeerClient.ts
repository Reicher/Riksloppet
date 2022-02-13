import EventEmitter from 'eventemitter3'
import { collection, CollectionReference, DocumentData, DocumentReference } from 'firebase/firestore'
import { PlayerMoveMessage } from './dataTypes'
import { MessageOchestrator } from './MessageOchestrator'
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

  isConnected: boolean
  clientName: string
  clientId: string
  ochestrator: MessageOchestrator

  constructor(_clientName: string, _clientDoc: DocumentReference<ClientData>, _ochestrator = new MessageOchestrator()) {
    super()

    this.clientName = _clientName
    this.clientId = _clientDoc.id
    this.clientDoc = _clientDoc
    this.ochestrator = _ochestrator
    this.connection = new RTCPeerConnection(servers)
    this.offerCandidates = collection(this.clientDoc, 'offerCandidates')
    this.answerCandidates = collection(this.clientDoc, 'answerCandidates')
  }

  sendData(dataMessage: PlayerMoveMessage): void {
    this.ochestrator.sendMessage(dataMessage)
  }

  connect(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
