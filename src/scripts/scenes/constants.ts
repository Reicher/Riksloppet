export enum PARTI_LEDAMOT {
  SOCIALDEMOKRAT = 'socialdemokraterna',
  MILJÖPARTIST = 'miljöpartiet',
  SVERIGEDEMOKRAT = 'sverigedemokraterna',
  MODERAT = 'moderaterna',
  LIBERAL = 'liberalerna',
  KRISTDEMOKRAT = 'kristdemokraterna',
  CENTERPARTIST = 'centern',
  VÄNSTERPARTIST = 'vänsterpartiet'
}
export const getRandomLedamot = () => {
  const index = Phaser.Math.Between(0, Object.values(PARTI_LEDAMOT).length)
  return Object.values(PARTI_LEDAMOT)[index]
}
