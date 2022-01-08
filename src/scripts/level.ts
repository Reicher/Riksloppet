export default class Level {
    ground
    bg1
    camera
    constructor(scene, length, ground, bg1) {

        this.camera = scene.cameras.main
        
        scene.physics.world.setBounds(0, 0, length, scene.HEIGHT)
        scene.cameras.main.setBounds(0, 0, length, scene.HEIGHT)

        this.bg1 = scene.add.tileSprite(0, 0, scene.WIDTH, scene.HEIGHT, bg1)
        this.ground = scene.add.tileSprite(0, 0, length, scene.HEIGHT, ground)

        this.bg1.setOrigin(0).setScrollFactor(0)
        this.bg1.fixedToCamera = true
        
        this.ground.setOrigin(0).setScrollFactor(1)
        this.ground.fixedToCamera = true  
    }

    update(time, delta, most_x) {
        //this.ground.tilePositionX += most_x
        //this.ground.tilePositionX = -this.camera.x;
        //this.ground.tilePositionX = Math.min(300, this.camera.x)
    }
}