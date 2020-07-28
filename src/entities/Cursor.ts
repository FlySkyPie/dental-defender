import 'phaser';
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import TilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;

class Cursor extends Sprite {
    scene: Scene;
    imageKey: string;
    wallLayer: TilemapLayer | undefined;
    entity: Phaser.GameObjects.GameObject | undefined;
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

    private isCollidedTile() {
        if (this.wallLayer === undefined) {
            return false;
        }
        let tile = this.wallLayer.getTileAtWorldXY(this.x, this.y, true).index;
        if (tile !== -1) {
            return true;
        }

        return false;
    }

    public isCollided(): boolean {
        let body = (this.body as Phaser.Physics.Arcade.Body);
        let collidedEntities = !body.touching.none || body.embedded;
        let collidedTile = this.isCollidedTile();
        return (collidedEntities || collidedTile);
    }

    public updateTexture(isDenied: boolean) {
        if (isDenied) {
            this.setTexture(this.imageKey + "_x");
        } else {
            this.setTexture(this.imageKey);
        }
    }

    public updateEntity(entity: Phaser.GameObjects.GameObject) {
        this.entity = entity;
    }

    public getLastCollided() {
        return this.entity;
    }

    update() {
        this.scene.input.mousePointer.updateWorldPoint(this.scene.cameras.main);
        this.x = this.scene.input.mousePointer.worldX;
        this.y = this.scene.input.mousePointer.worldY;
    }

    setMode(imageKey: string) {
        this.imageKey = imageKey;
        this.setTexture(imageKey);
        (this.body as Phaser.Physics.Arcade.Body)
            .setSize(this.displayWidth, this.displayHeight);
    }
}

export {Cursor as default};