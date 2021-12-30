

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    //this.load.image('backgrund', 'assets/img/Backgrund.png')
    this.load.spritesheet('player', 'assets/img/Politiker.png', { frameWidth: 17, frameHeight: 32, endFrame: 40 });	
    this.load.image('peng', 'assets/img/Peng.png')

		// load images
    this.load.image('mark', 'assets/img/mark.png');
    this.load.image('bakgrund1', 'assets/img/bakgrund1.png');
    this.load.image('bakgrund2', 'assets/img/bakgrund2.png');
    this.load.image('bakgrund3', 'assets/img/bakgrund3.png');

    this.load.image('splash', 'assets/img/splash.png');
    this.load.image('title', 'assets/img/titel.png');
    this.load.image('levelSetting', 'assets/img/levelSettings.png');
    this.load.image('charSelect', 'assets/img/charSelect.png');    
    this.load.image('postGame', 'assets/img/postGame.png');    

    this.load.image('peng', 'assets/img/Peng.png');
  }

  create() {    
    console.log('PreLoad')

    //this.scene.start('SplashScene')
    this.scene.start('MainScene')
  }
}
