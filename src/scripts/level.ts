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

        scene.cameras.main.setBounds(0, 0, length, scene.HEIGHT)

        this.bakgrund = scene.add.tileSprite(0, 0, length, scene.HEIGHT, bg1)
        this.bakgrund.setOrigin(0).setScrollFactor(0)
        this.bakgrund.fixedToCamera = true

        this.mark = scene.add.tileSprite(0, 0, length, scene.HEIGHT, ground)
        this.mark.setOrigin(0).setScrollFactor(1)
        this.mark.fixedToCamera = true 




    }

    update(time, delta) {
    }

}