type SessionDescription = {
  sdp?: string
  type: RTCSdpType
}
export type ClientData = {
  clientName?: string
  answer?: SessionDescription
  offer?: SessionDescription
}
