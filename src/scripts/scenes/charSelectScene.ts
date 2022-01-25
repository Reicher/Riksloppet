export default class CharSelectScene extends Phaser.Scene {
  cursors
  constructor() {
    super({ key: 'CharSelectScene' })
  }

  addPorträtt(){
    for (let col = 1; col <= 4; col++) {
      for (let row = 1; row <= 2; row++) {
        let sprite = this.add.sprite((960/2)-375 + 150*col, 170*row, 'annie_porträtt').setScale(1.3)
        sprite.setTint(0xbbbbbb)
        sprite.setInteractive().on('pointerdown', function(this){
          sprite.setTint(0xffffff)
          let internal = this.add.sprite(960/2, 480, 'välj')
          internal.setInteractive().on('pointerdown', function(this){
            this.scene.start('MainScene')
          }, this);
        }, this);

        sprite.setInteractive().on('hover', function(this){
          //Något
        }, this);
      }
    }
  }

  create() {
    console.log('CharSelectScene')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.add.sprite(960/2, 55, 'char_text').setScale(0.8)

    this.addPorträtt()

  }

  update() {
  }
}
