import { addDoc, collection, CollectionReference, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { createPeerConnection } from './createPeerConnection'
import { firebase } from './firebase'
import { MessageOchestrator } from './messages'
import { ClientData } from './types'

export const joinRoom = (roomId: string, clientName: string, clientId: string, ochestrator: MessageOchestrator) =>
  new Promise(async resolve => {
    const peerConnection = createPeerConnection()
    const roomDoc = doc(collection(firebase.db, 'rooms'), roomId.trim())
    const clients = collection(roomDoc, 'clients') as CollectionReference<ClientData>
    const clientDoc = doc(clients, clientId)
    const offerCandidates = collection(clientDoc, 'offerCandidates')
    const answerCandidates = collection(clientDoc, 'answerCandidates')

    await setDoc(clientDoc, {
      clientName
    })

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        addDoc(answerCandidates, candidate.toJSON())
      }
    }
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        resolve(undefined)
      }
    }
    ochestrator.addConnection(peerConnection)

    onSnapshot(clientDoc, async snapshot => {
      const clientData = snapshot.data()
      if (!clientData) return
      if (!clientData.offer) return
      if (clientData.answer) return

      const offerDescription = new RTCSessionDescription(clientData.offer)
      await peerConnection.setRemoteDescription(offerDescription)

      const answerDescription = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answerDescription)

      await updateDoc(clientDoc, { answer: { sdp: answerDescription.sdp, type: answerDescription.type } })
    })

    onSnapshot(offerCandidates, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          peerConnection.addIceCandidate(candidate)
        }
      })
    })
  })
