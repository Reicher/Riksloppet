export enum PARTI_LEDAMOT {
  SOCIALDEMOKRAT = 'Maggan',
  MILJÖPARTIST = 'PerOMär',
  SVERIGEDEMOKRAT = 'Jimpa',
  MODERAT = 'Uffe',
  LIBERAL = 'Nyam',
  KRISTDEMOKRAT = 'Ebba',
  CENTERPARTIST = 'Annie',
  VÄNSTERPARTIST = 'Nooshi'
}
export const getRandomLedamot = () => {
  const index = Phaser.Math.Between(0, Object.values(PARTI_LEDAMOT).length)
  return Object.values(PARTI_LEDAMOT)[index]
}

export const MAX_PLAYERS = 8
