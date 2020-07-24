import 'phaser';
import resourceJson from './data/resources.json';

class ResourceLoader {
    resources: any;
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.resources = resourceJson;
        this.scene = scene;
    }

    /**
     * preload spinner image and progress bar.
     */
    preload() {
        let scene: any = this.scene;
        scene.progressBar = scene.add.graphics();
        scene.progressBox = scene.add.graphics();
        scene.progressBox.fillStyle(0x222222, 0.8);
        scene.progressBox.fillRect(1024 / 2 -320/2, 600 - 50/2, 320, 50);

        scene.load.spritesheet('spinner', 'assets/spritesheets/spinner.png', {frameWidth: 15, frameHeight: 15});
    }

    create() {
        return new Promise((resolve, reject) => {
            let scene: any = this.scene;
            let spinner = scene.add.sprite(512, 384, 'spinner');

            const anims = scene.anims;
            anims.create({
                key: "spin",
                frames: anims.generateFrameNames("spinner", {start: 0, end: 7}),
                frameRate: 10,
                repeat: -1
            });

            spinner.anims.play("spin", true);

            //	You can listen for each of these events from Phaser.Loader
            this.scene.load.on('progress', (percentage: number) => {this.loadProgressListener(percentage)});
            this.scene.load.on('complete', () => {
                this.loadCompleteListener();
                resolve();
            });
            this.scene.load.on('loaderror', ()=>{
                reject();
            });
            this.startLoad();
        });
    }

    /**
       * secondary loader
       */
    startLoad() {
        this.addLoadQueue();
        this.scene.load.start();
    }

    //	This callback is sent the following parameters:
    loadProgressListener(percentage: number) {
        let scene: any = this.scene;

        scene.progressBar.clear();
        scene.progressBar.fillStyle(0xffffff, 1);
        let width = 300 * percentage;
        scene.progressBar.fillRect(1024 / 2 -300/2, 600 - 30/2, width, 30);
    }

    loadCompleteListener() {
        let scene: any = this.scene;
        scene.progressBar.destroy();
        scene.progressBox.destroy();
    }

    addLoadQueue() {
        if (this.scene !== undefined) {
            //IMAGES
            for (let i = 0; i < this.resources.images.length; i++) {
                let obj = this.resources.images[i];
                this.scene.load.image(obj.name, obj.path);
            }

            //SPRITESHEETS
            for (let i = 0; i < this.resources.spritesheets.length; i++) {
                let obj = this.resources.spritesheets[i];
                this.scene.load.spritesheet(obj.name, obj.path,
                    {frameWidth: obj.width, frameHeight: obj.height});
            }

            //TILEMAPS
            for (let i = 0; i < this.resources.tilemaps.length; i++) {
                let obj = this.resources.tilemaps[i];
                this.scene.load.tilemapTiledJSON(obj.name, obj.path);
            }

            //SOUNDS
            for (let i = 0; i < this.resources.audio.length; i++) {
                let obj = this.resources.audio[i];
                this.scene.load.audio(obj.name, obj.path);
            }
        }
    }
}

export {ResourceLoader as default};