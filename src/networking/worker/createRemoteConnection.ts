import { addDoc, collection, DocumentReference, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { createPeerConnection } from './createPeerConnection'
import { MessageOchestrator } from './messages'
import { ClientData } from './types'

export const createRemoteConnection = async (
  clientDoc: DocumentReference<ClientData>,
  orchestrator: MessageOchestrator
) =>
  new Promise<{ clientName: string; clientId: string }>(async resolve => {
    const peerConnection = createPeerConnection()
    const offerCandidates = collection(clientDoc, 'offerCandidates')
    const answerCandidates = collection(clientDoc, 'answerCandidates')

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        addDoc(offerCandidates, candidate.toJSON())
      }
    }

    peerConnection.onconnectionstatechange = async () => {
      if (peerConnection.connectionState === 'connected') {
        console.log(`Remote client "${clientDoc.id}" successfully connected!`)
        const clientData = (await getDoc(clientDoc)).data()
        if (clientData?.clientName === undefined) return
        resolve({ clientName: clientData.clientName, clientId: clientDoc.id })
      }
    }

    orchestrator.addConnection(peerConnection)

    const offerDescription = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offerDescription)
    await setDoc(clientDoc, { offer: { sdp: offerDescription.sdp, type: offerDescription.type } })

    onSnapshot(clientDoc, async snapshot => {
      const data = snapshot.data()
      if (!peerConnection.currentRemoteDescription && data?.answer) {
        console.log('Got an answer')
        const answerDescription = new RTCSessionDescription(data.answer)
        await peerConnection.setRemoteDescription(answerDescription)
        console.log('Answer setup done')
      }
    })

    onSnapshot(answerCandidates, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          peerConnection.addIceCandidate(candidate)
        }
      })
    })
  })
