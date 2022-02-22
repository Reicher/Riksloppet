const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

export const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(servers)
    return peerConnection
}