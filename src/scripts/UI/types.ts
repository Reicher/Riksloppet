export type UIPosition = {
  x: number
  y: number
  fromCenter: boolean
  relative: boolean
}

export type EventHandler<TEvent extends keyof HTMLElementEventMap> = (ev: HTMLElementEventMap[TEvent]) => void
