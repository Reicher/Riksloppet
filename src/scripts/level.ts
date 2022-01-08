export default class Level {
    bakgrund 
    mark
    förgrund1
    förgrund2

    camera
    scene
    constructor(scene, length, ground, bg1) {

        this.camera = scene.cameras.main
        this.scene = scene
        
        scene.physics.world.setBounds(0, 150, length, scene.HEIGHT-150)
        scene.physics.world.setBoundsCollision()

        scene.cameras.main.setBounds(0, 0, length, scene.HEIGHT)

        this.bakgrund = scene.add.tileSprite(0, 0, length, scene.HEIGHT, bg1)
        this.bakgrund.setOrigin(0).setScrollFactor(0)
        this.bakgrund.fixedToCamera = true

        this.mark = scene.add.tileSprite(0, 0, length, scene.HEIGHT, ground)
        this.mark.setOrigin(0).setScrollFactor(1)
        this.mark.fixedToCamera = true 

        let förgrund2 = scene.add.tileSprite(0, scene.HEIGHT-100, length, scene.HEIGHT, 'förgrund2')
        förgrund2.setOrigin(0).setScrollFactor(1.5)
        förgrund2.fixedToCamera = true

        let förgrund1 = scene.add.tileSprite(0, scene.HEIGHT-100, length, scene.HEIGHT, 'förgrund1')
        förgrund1.setOrigin(0).setScrollFactor(2)
        förgrund1.fixedToCamera = true


    }

    update(time, delta) {
    }

}