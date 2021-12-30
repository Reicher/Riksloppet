

export default class CharSelectScene extends Phaser.Scene {
  cursors
  constructor() {
    super({ key: 'CharSelectScene' })
  }
  create() {    
    console.log('CharSelectScene')
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.sprite(0, 0, 'charSelect').setOrigin(0)


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

  update(){
    if (this.cursors.space.isDown)
    {
      this.scene.start('MainScene')
    }
  }
}
