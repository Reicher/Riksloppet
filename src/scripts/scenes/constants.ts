export enum PARTI_LEDAMOT {
  SOCIALDEMOKRAT = 'Maggan',
  MILJÖPARTIST = 'PerOMär',
  SVERIGEDEMOKRAT = 'Jimmie',
  MODERAT = 'Uffe',
  LIBERAL = 'Nyam',
  KRISTDEMOKRAT = 'Ebba',
  CENTERPARTIST = 'Annie',
  VÄNSTERPARTIST = 'Nooshi'
}

export const LEDAMOT_START_POSITION = {
  [PARTI_LEDAMOT.KRISTDEMOKRAT]: {
    x: 150,
    y: 50
  },
  [PARTI_LEDAMOT.VÄNSTERPARTIST]: {
    x: 50,
    y: 50
  },
  [PARTI_LEDAMOT.CENTERPARTIST]: {
    x: 100,
    y: 50
  },
  [PARTI_LEDAMOT.SVERIGEDEMOKRAT]: {
    x: 200,
    y: 50
  },
  [PARTI_LEDAMOT.SOCIALDEMOKRAT]: {
    x: 150,
    y: 150
  },
  [PARTI_LEDAMOT.LIBERAL]: {
    x: 50,
    y: 150
  },
  [PARTI_LEDAMOT.MILJÖPARTIST]: {
    x: 100,
    y: 150
  },
  [PARTI_LEDAMOT.MODERAT]: {
    x: 200,
    y: 150
  }
}

export type Parti = 'kd' | 'c' | 'v' | 'sd'
export const getLedamotForParti = (parti: Parti) => {
  switch (parti) {
    case 'kd':
      return PARTI_LEDAMOT.KRISTDEMOKRAT
    case 'c':
      return PARTI_LEDAMOT.CENTERPARTIST
    case 'v':
      return PARTI_LEDAMOT.VÄNSTERPARTIST
    case 'sd':
      return PARTI_LEDAMOT.SVERIGEDEMOKRAT
    default:
      return getRandomLedamot()
  }
}

export const getPartiForLedamot = (ledamot: PARTI_LEDAMOT): Parti => {
  switch (ledamot) {
    case PARTI_LEDAMOT.CENTERPARTIST:
      return 'c'
    case PARTI_LEDAMOT.KRISTDEMOKRAT:
      return 'kd'
    case PARTI_LEDAMOT.SVERIGEDEMOKRAT:
      return 'sd'
    case PARTI_LEDAMOT.VÄNSTERPARTIST:
      return 'v'
    default:
      return 'v'
  }
}

export const getColorForParti = (parti: Parti) => {
  switch (parti) {
    case 'kd':
      return '#005ea1'
    case 'c':
      return '#114838'
    case 'v':
      return '#ed1c24'
    case 'sd':
      return '#1f135b'
    default:
      return 'black'
  }
}

export const getXPostitionForLedamot = (ledamot: PARTI_LEDAMOT) => {
  if (ledamot in LEDAMOT_START_POSITION) return LEDAMOT_START_POSITION[ledamot].x
  return 0
}

export const getRandomLedamot = () => {
  const index = Phaser.Math.Between(0, Object.values(PARTI_LEDAMOT).length - 1)
  return Object.values(PARTI_LEDAMOT)[index]
}

export const MAX_PLAYERS = 8
