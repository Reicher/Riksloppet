

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.spritesheet('annie_run', 'assets/img/Annie_spring-Sheet.png', { frameWidth: 40, frameHeight: 80})
    this.load.spritesheet('annie_stopp', 'assets/img/Annie_stopp-Sheet.png', { frameWidth: 40, frameHeight: 80})

    this.load.spritesheet('statist', 'assets/img/statist.png', { frameWidth: 89, frameHeight: 100})
    
    this.load.image('gata', 'assets/img/Gata.png');
    this.load.image('himmel', 'assets/img/Himmel och skyline.png');

    this.load.image('förgrund1', 'assets/img/Förgrund1.png');
    this.load.image('förgrund2', 'assets/img/Förgrund2.png');
    
    this.load.image('splash', 'assets/img/splash.png');
    this.load.image('title', 'assets/img/titel.png');
    this.load.image('levelSetting', 'assets/img/levelSettings.png');
    this.load.image('charSelect', 'assets/img/charSelect.png');    
    this.load.image('postGame', 'assets/img/postGame.png');    

    this.load.image('bil', 'assets/img/Blå bil.png');

    this.load.image('peng', 'assets/img/Peng.png');
    this.load.image('neddut', 'assets/img/neddut.png');
  }

  create() {    
    console.log('PreLoad')

    //this.scene.start('SplashScene')
    this.scene.start('MainScene')
  }
}
