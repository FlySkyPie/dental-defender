import 'phaser';
import ResourceLoader from './ResourceLoader';
import Player from './Player';
import Cursor from './Cursor';
import AnimationLoader from './AnimationLoader';
import Tooth from './Tooth';

class BattlezoneScene extends Phaser.Scene {
    player: Player | undefined;
    music: Phaser.Sound.WebAudioSound | undefined;
    bulletsGroup: Phaser.GameObjects.Group | undefined;

    loader: ResourceLoader;
    isLoaded: boolean;

    progressBar: Phaser.GameObjects.Graphics | undefined;
    progressBox: Phaser.GameObjects.Graphics | undefined;

    wallsLayer: Phaser.Tilemaps.StaticTilemapLayer | any;

    constructor() {
        super('battlezone');
        this.isLoaded = false;
        this.loader = new ResourceLoader(this);
    }

    preload() {
        this.loader.preload();
    }


    create() {
        this.loader.create().then(() => {
            this.bulletsGroup = this.add.group();

            const map = this.make.tilemap({key: "test3"});
            const tileset = map.addTilesetImage("tileset", "tileset-image");
            const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
            this.wallsLayer = map.createStaticLayer("walls", tileset, 0, 0);
            this.wallsLayer.setCollisionByProperty({collides: true});
            this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

            let animationLoader = new AnimationLoader();
            animationLoader.load(this);

            new Cursor(this);
            this.player = new Player(this, [800, 300]);
            let tooth = new Tooth(this, [800, 400]);

            // Watch the player and worldLayer for collisions, for the duration of the scene:
            this.physics.add.collider(this.player, this.wallsLayer);
            this.physics.add.collider(this.bulletsGroup, this.wallsLayer, (bullet: any) => {bullet.destroy()});
            this.physics.add.collider(this.player, tooth);
            this.physics.add.collider(this.bulletsGroup, tooth, (bullet: any) => {bullet.destroy()});

            const camera = this.cameras.main;
            camera.startFollow(this.player);
            camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

            this.physics.world.createDebugGraphic();
            const debugGraphics = this.add.graphics().setAlpha(0.75);
            this.wallsLayer.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });

            this.music = (this.sound.add('game_music') as Phaser.Sound.WebAudioSound);
            this.music.setLoop(true);
            this.music.play();

            this.isLoaded = true;
        });
    }

    update(time: any, delta: any) {


    }
}

export {BattlezoneScene as default};