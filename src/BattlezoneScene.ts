import 'phaser';

import Player from './entities/Player';
import Cursor from './entities/Cursor';
import Tooth from './entities/Tooth';
import Corn from './entities/Corn';
import Mint from './entities/Mint';
import Gumball from './entities/Gumball';
import Team from './utils/Team';
import AnimationLoader from './loaders/AnimationLoader';
import ResourceLoader from './loaders/ResourceLoader';
import CollisionLoader from './loaders/CollisionLoader';

import HeadUpDisplay from './HeadUpDisplay';

class BattlezoneScene extends Phaser.Scene {
    tooth: Tooth | any;
    player: Player | any;
    bulletsGroup: Phaser.GameObjects.Group | any;
    monstersGroup: Phaser.GameObjects.Group | any;
    monsterBulletGroup: Phaser.GameObjects.Group | any;

    loader: ResourceLoader;
    isLoaded: boolean;

    music: Phaser.Sound.WebAudioSound | any;
    progressBar: Phaser.GameObjects.Graphics | any;
    progressBox: Phaser.GameObjects.Graphics | any;
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
            this.monstersGroup = this.add.group();
            this.monsterBulletGroup = this.add.group();

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
            this.tooth = new Tooth(this, [800, 400]);

            new HeadUpDisplay(this, 0, 0);

            //test
            new Corn(this, [1250, 300]);

            let collisionLoader = new CollisionLoader();
            collisionLoader.load(this);

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