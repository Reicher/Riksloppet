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

// this.riksdagen = new Phaser.Physics.Arcade.Group(this.physics.world, this)
// let spelare = new PartiLedare(this, 250, 200, parti_val, this.input.keyboard.createCursorKeys())
// this.riksdagen.add(spelare)
// spelare.setCollideWorldBounds(true)

// let partinamn = ['kd', 'c', 'v', 'sd']
// const index = partinamn.indexOf(parti_val, 0)
// partinamn.splice(index, 1)
// for (let p = 0; p <= partinamn.length; p++) {
//   // Partierna ska ha startplatser som kopplas till mandat i riksdagen
//   let ledamot
//   if (partinamn[p] == 'kd') ledamot = new PartiLedare(this, 150, 200, 'kd')
//   else if (partinamn[p] == 'v') ledamot = new PartiLedare(this, 50, 200, 'v')
//   else if (partinamn[p] == 'c') ledamot = new PartiLedare(this, 100, 300, 'c')
//   else if (partinamn[p] == 'sd') ledamot = new PartiLedare(this, 200, 300, 'sd')
//   else ledamot = new PartiLedare(this, 50, 400, 'VILDE')

//   this.riksdagen.add(ledamot)
//   ledamot.setCollideWorldBounds(true)
// }
