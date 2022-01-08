

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.spritesheet('player', 'assets/img/Politiker.png', { frameWidth: 17, frameHeight: 32 });	
    this.load.image('peng', 'assets/img/Peng.png')

    this.load.spritesheet('annie_run', 'assets/img/Annie_spring-Sheet.png', { frameWidth: 40, frameHeight: 80})
    this.load.image('gata', 'assets/img/Gata.png');
    this.load.image('himmel', 'assets/img/Himmel och skyline.png');
    

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
