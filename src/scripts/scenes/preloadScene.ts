

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    //this.load.image('backgrund', 'assets/img/Backgrund.png')
    this.load.spritesheet('player', 'assets/img/Politiker.png', { frameWidth: 17, frameHeight: 32, endFrame: 40 });	
    this.load.image('peng', 'assets/img/Peng.png')

		// load images
		//this.load.image('sky', 'assets/img/Sky.png');
		//this.load.image('mountains', 'assets/img/Mountains.png');
		//this.load.image('hills', 'assets/img/Hills.png');
		//this.load.image('forest', 'assets/img/Forest.png');

    this.load.image('mark', 'assets/img/mark.png');
    this.load.image('bakgrund1', 'assets/img/bakgrund1.png');
    this.load.image('bakgrund2', 'assets/img/bakgrund2.png');
    this.load.image('bakgrund3', 'assets/img/bakgrund3.png');

    this.load.image('splash', 'assets/img/splash.png');
    this.load.image('title', 'assets/img/titel.png');
    this.load.image('levelSetting', 'assets/img/levelSettings.png');
    this.load.image('charSelect', 'assets/img/charSelect.png');    
    this.load.image('postGame', 'assets/img/postGame.png');    
  }

  create() {    
    console.log('PreLoad')

    //this.scene.start('SplashScene')
    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
