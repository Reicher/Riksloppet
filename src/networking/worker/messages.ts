import { v4 as uuid } from 'uuid'
import { DataMessage } from '../dataTypes'

const DATA_CHANNEL_LABEL = 'DATA_CHANNEL'

export const createDataMessageOchestrator = () => {
    const channels: Record<string, RTCDataChannel> = {}
    let isHost = false

    const echoMessage = (message: DataMessage, skipChannelId: string) => {
        for (const [id, channel] of Object.entries(channels)) {
            if (id !== skipChannelId) {
                channel.send(JSON.stringify(message))
            }
        }
    }

    const setupChannel = (channel: RTCDataChannel, id = uuid()) => {
        channel.onmessage = (event) => {
            const message = JSON.parse(event.data) as DataMessage
            postMessage(message)
            if (isHost) {
                echoMessage(message, id)
            }
        }

        channel.onclose = () => {
            console.log(`Channel ${id} closed!`)
            delete channels[id]
        }

        channel.onerror = (event) => {
            console.error(`Channel ${id} error!`, event)
            delete channels[id]
        }

        channel.onopen = () => {
            console.log(`Channel ${id} connected!`)
        }

        channels[id] = channel
    }

    const addPeerConnection = (peerConnection: RTCPeerConnection) => {
        peerConnection.ondatachannel = (event) => setupChannel(event.channel)
    }

    const addHostConnection = (peerConnection: RTCPeerConnection) => {
        const channel = peerConnection.createDataChannel(DATA_CHANNEL_LABEL)
        setupChannel(channel)
    }

    const sendMessage = (message: DataMessage) => {
        for (const channel of Object.values(channels)) {
            channel.send(JSON.stringify(message))
        }
    }

    return {
        addConnection: (peerConnection: RTCPeerConnection) => {
            if(isHost) return addHostConnection(peerConnection)
            return addPeerConnection(peerConnection)
        },
        sendMessage,
        setAsHost: () => isHost = true
    }
}
export type MessageOchestrator = ReturnType<typeof createDataMessageOchestrator>