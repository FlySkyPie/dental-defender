import 'phaser';
import SceneSwitcher from './interfaces/SceneSwitcher';
import Loader from './loaders/ResourcePreloader';
import json from './data/resources.json';

class LoadScene extends Phaser.Scene {
    switcher: SceneSwitcher;
    progressBar: Phaser.GameObjects.Graphics | undefined;
    progressBox: Phaser.GameObjects.Graphics | undefined;
    constructor(switcher: SceneSwitcher) {
        super('load-scene');
        this.switcher = switcher;
    }
    
    preload() {
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(1024 / 2 - 320 / 2, 600 - 50 / 2, 320, 50);
        this.load.spritesheet('spinner', 'assets/spritesheets/spinner.png', {frameWidth: 15, frameHeight: 15});
    }

    create() {
        let spinner = this.add.sprite(512, 384, 'spinner');

        const anims = this.anims;
        anims.create({
            key: "spin",
            frames: anims.generateFrameNames("spinner", {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        spinner.anims.play("spin", true);

        this.load.on('progress', (percentage: number) => {
            this.loadProgressListener(percentage);
        });
        this.load.on('complete', () => {
            this.switcher.startGame();
        });
        
        let loader = new Loader(this);
        loader.preload(json);
        this.load.start();
    }

    private loadProgressListener(percentage: number) {
        if (this.progressBar === undefined) {
            return;
        }
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        let width = 300 * percentage;
        this.progressBar.fillRect(1024 / 2 - 300 / 2, 600 - 30 / 2, width, 30);
    }
}

export default LoadScene;
