import 'phaser';
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;

class Cursor extends Sprite {
    scene: Scene;
    constructor(scene: Scene) {
        super(scene, 0, 0, 'gun_cursor');
        this.scene = scene;
        this.scene.add.existing(this);
        this.alpha = 0.5;
        this.scene.events.on('update', () => {
            this.update()
        });
    }

    update() {
        this.scene.input.mousePointer.updateWorldPoint(this.scene.cameras.main);
        this.x = this.scene.input.mousePointer.worldX;
        this.y = this.scene.input.mousePointer.worldY;
    }
}

export {Cursor as default};