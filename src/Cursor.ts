import 'phaser';
import BattlezoneScene from './BattlezoneScene';
import Player from './Player';

import Sprite = Phaser.GameObjects.Sprite;
//import Scene = Phaser.Scene;

class Cursor extends Sprite {
    scene: BattlezoneScene;
    constructor(scene: BattlezoneScene) {
        super(scene, 0, 0, 'gun_cursor');
        this.scene = scene;
        this.scene.add.existing(this);
        this.setSize(36, 36);
        this.alpha = 0.5;
        this.scene.events.on('update', () => {
            this.update()
        });

    }

    update() {
        let x = this.x = this.scene.input.mousePointer.worldX;
        let y = this.y = this.scene.input.mousePointer.worldY;
        if (this.scene.input.mousePointer.isDown) {
            (this.scene.player as Player).attack([x, y]);
        }
    }
}

export {Cursor as default};