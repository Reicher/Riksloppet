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
    x: 150
  },
  [PARTI_LEDAMOT.VÄNSTERPARTIST]: {
    x: 50
  },
  [PARTI_LEDAMOT.CENTERPARTIST]: {
    x: 100
  },
  [PARTI_LEDAMOT.SVERIGEDEMOKRAT]: {
    x: 200
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

export const getXPostitionForLedamot = (ledamot: PARTI_LEDAMOT) => {
  if (ledamot in LEDAMOT_START_POSITION) return LEDAMOT_START_POSITION[ledamot].x
  return 0
}

export const getRandomLedamot = () => {
  const index = Phaser.Math.Between(0, Object.values(PARTI_LEDAMOT).length - 1)
  return Object.values(PARTI_LEDAMOT)[index]
}

export const MAX_PLAYERS = 8
