import 'phaser';
import Scene = Phaser.Scene;

class ResourcePreloader {
    scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;
    }

    public preload(json: any) {
        //IMAGES
        for (let i = 0; i < json.images.length; i++) {
            let obj = json.images[i];
            this.scene.load.image(obj.name, obj.path);
        }

        //SPRITESHEETS
        for (let i = 0; i < json.spritesheets.length; i++) {
            let obj = json.spritesheets[i];
            this.scene.load.spritesheet(obj.name, obj.path,
                {frameWidth: obj.width, frameHeight: obj.height});
        }

        //TILEMAPS
        for (let i = 0; i < json.tilemaps.length; i++) {
            let obj = json.tilemaps[i];
            this.scene.load.tilemapTiledJSON(obj.name, obj.path);
        }

        //SOUNDS
        for (let i = 0; i < json.audio.length; i++) {
            let obj = json.audio[i];
            this.scene.load.audio(obj.name, obj.path);
        }

    }

}
export default ResourcePreloader;