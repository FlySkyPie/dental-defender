import 'phaser';

import Player from './entities/Player';
import Cursor from './entities/Cursor';
import Tooth from './entities/Tooth';
import Corn from './entities/Corn';
import AnimationLoader from './AnimationLoader';
import ResourceLoader from './ResourceLoader';

class BattlezoneScene extends Phaser.Scene {
    tooth: Tooth | undefined;
    player: Player | undefined;
    bulletsGroup: Phaser.GameObjects.Group | undefined;
    monstersGroup: Phaser.GameObjects.Group | undefined;

    loader: ResourceLoader;
    isLoaded: boolean;

    music: Phaser.Sound.WebAudioSound | undefined;
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
            this.monstersGroup = this.add.group();

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

            //test
            new Corn(this, [800, 600]);

            // Watch the player and worldLayer for collisions, for the duration of the scene:
            this.physics.add.collider(this.player, this.wallsLayer);

            this.physics.add.collider(this.player, this.tooth);
            this.physics.add.collider(this.bulletsGroup, this.wallsLayer,
                (bullet: any) => {bullet.destroy()});
            this.physics.add.collider(this.bulletsGroup, this.tooth,
                (bullet: any) => {bullet.destroy();});
            this.physics.add.collider(this.bulletsGroup, this.monstersGroup,
                (bullet: any, monster: any) => {
                    monster.damage(bullet.host.attackDamage, bullet.host);
                    bullet.destroy();
                });

            this.physics.add.collider(this.monstersGroup, this.tooth, (monster: any, tooth: any) => {
                if (monster instanceof Corn) {
                    tooth.damage(30);
                    monster.destroy();
                }
            });




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