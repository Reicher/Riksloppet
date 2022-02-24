export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.spritesheet('c_run', 'assets/img/Annie_spring-Sheet.png', { frameWidth: 40, frameHeight: 80 })
    this.load.spritesheet('c_stopp', 'assets/img/Annie_stopp-Sheet.png', { frameWidth: 40, frameHeight: 80 })
    this.load.spritesheet('c_slag', 'assets/img/Annie_slag-Sheet.png', { frameWidth: 40, frameHeight: 80 })
    this.load.spritesheet('c_krock', 'assets/img/Annie_krock-Sheet.png', { frameWidth: 40, frameHeight: 80 })
    this.load.image('c_porträtt', 'assets/img/Annie_porträtt.png')
    this.load.image('kd_porträtt', 'assets/img/Ebba_porträtt.png')
    this.load.image('v_porträtt', 'assets/img/Nooshi_porträtt.png')
    this.load.image('sd_porträtt', 'assets/img/Jimmie_porträtt.png')

    this.load.image('logo', 'assets/img/tns-logo.png')
    this.load.image('välj', 'assets/img/välj.png')

    this.load.spritesheet('statist', 'assets/img/statist.png', { frameWidth: 89, frameHeight: 100 })
    this.load.spritesheet('åskådare_kille_kast', 'assets/img/åskådare_kille_kast-Sheet.png', {
      frameWidth: 40,
      frameHeight: 80
    })
    this.load.image('åskådare_kille', 'assets/img/åskådare_kille_bära.png')

    this.load.image('gata', 'assets/img/Gata.png')
    this.load.image('himmel', 'assets/img/Himmel och skyline.png')

    this.load.image('förgrund1', 'assets/img/Förgrund1.png')
    this.load.image('förgrund2', 'assets/img/Förgrund2.png')

    this.load.image('splash', 'assets/img/splash.png')
    this.load.image('title', 'assets/img/titel.png')
    this.load.image('levelSetting', 'assets/img/levelSettings.png')
    this.load.image('char_text', 'assets/img/char_text.png')
    this.load.image('postGame', 'assets/img/postGame.png')
    this.load.image('game_type_select', 'assets/img/GameTypeSelectScreen.png')

    this.load.image('bil', 'assets/img/Blå bil.png')
    this.load.image('bil_röd', 'assets/img/parkerad_bil_röd.png')

    this.load.image('peng', 'assets/img/Peng.png')
    this.load.image('neddut', 'assets/img/neddut.png')
  }

  create() {
    console.log('PreLoad')

    this.scene.start('SplashScene')
    // this.scene.start('CharSelectScene')
  }
}
