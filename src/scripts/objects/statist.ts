import Partiledare from "./partiLedare"

export default class Statist extends Phaser.Physics.Arcade.Sprite {
  powerup : any // Kan va null
  constructor(scene, x: number, y: number, key: string, powerup : any) {
    super(scene, x, y, key)

    scene.anims.create({
      key: 'smält',
      frameRate: 20,
      frames: this.anims.generateFrameNumbers('statist', { start: 0, end: 8 }),
      repeat: 0
    })

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setBodySize(30, 30)
    this.body.setOffset(10, 50)    
    this.depth = this.y

    if(powerup){
      this.powerup = powerup
      this.powerup.setPosition(x, y-this.body.height-30)
      this.powerup.depth = this.y
    }
  }

  collidedWith(ledare: Partiledare) {
    ledare.knockOut()
    this.destroy()
  }

  destroy() {   
    if (this.powerup)
      this.powerup.destroy(true)

    this.play('smält', true)
    this.once('animationcomplete', () => {      
      super.destroy()
    }) 
  }
}