export default class Level {
  constructor(scene, length, ground, bg1, bg2) {
    
    scene.physics.world.setBounds(0, 0, length, scene.HEIGHT)

    scene.add.tileSprite(0, 0, scene.WIDTH, length, bg2).setOrigin(0).setScrollFactor(0.6)
    scene.add.tileSprite(0, 0, scene.WIDTH, length, bg1).setOrigin(0).setScrollFactor(0.9)
    
    scene.add.tileSprite(0, 0, scene.WIDTH, scene.HEIGHT, ground).setOrigin(0)
    
  }

  update(time, delta) {
  }
}