import 'phaser';
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import TilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;

class Cursor extends Sprite {
    scene: Scene;
    imageKey: string;
    wallLayer: TilemapLayer | undefined;
    constructor(scene: Scene) {
        super(scene, 0, 0, 'gun_cursor');
        this.imageKey = 'gun_cursor';
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.alpha = 0.5;

        this.scene.events.on('update', () => {
            this.update()
        });
    }

    setWallLayer(wallLayer: TilemapLayer) {
        this.wallLayer = wallLayer;
    }

    isCollidedTile() {
        if (this.wallLayer === undefined) {
            return false;
        }
        let tile = this.wallLayer.getTileAtWorldXY(this.x, this.y, true).index;
        if (tile !== -1) {
            return true;
        }

        return false;
    }

    update() {
        this.scene.input.mousePointer.updateWorldPoint(this.scene.cameras.main);
        this.x = this.scene.input.mousePointer.worldX;
        this.y = this.scene.input.mousePointer.worldY;

        //overlap detect
        let body =(this.body as Phaser.Physics.Arcade.Body);
        let collidedEntities = !body.touching.none || body.embedded;
        let collidedTile = this.isCollidedTile();
        if ( this.imageKey !== 'gun_cursor'){
            if(collidedEntities || collidedTile ){
                this.setTexture(this.imageKey + "_x");
            }else{
                this.setTexture(this.imageKey);
            }
        }
    }

    setMode(imageKey: string) {
        this.imageKey = imageKey;
        this.setTexture(imageKey);
        (this.body as Phaser.Physics.Arcade.Body)
            .setSize(this.displayWidth, this.displayHeight);
    }
}

export {Cursor as default};