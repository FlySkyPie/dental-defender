import 'phaser';

import Player from './entities/Player';
import Cursor from './entities/Cursor';
import Tooth from './entities/Tooth';
import Corn from './entities/Corn';
import Mint from './entities/Mint';
import Gumball from './entities/Gumball';
import Turret from './entities/Turret';
import TurretType from './utils/TurretType';
import AnimationLoader from './loaders/AnimationLoader';
import CollisionLoader from './loaders/CollisionLoader';
import SceneSwitcher from './interfaces/SceneSwitcher';

class BattlezoneScene extends Phaser.Scene {
    tooth: Tooth | any;
    player: Player | any;
    bulletsGroup: Phaser.GameObjects.Group | any;
    monstersGroup: Phaser.GameObjects.Group | any;
    monsterBulletGroup: Phaser.GameObjects.Group | any;
    turretsGroup: Phaser.GameObjects.Group | any;

    music: Phaser.Sound.WebAudioSound | any;
    progressBar: Phaser.GameObjects.Graphics | any;
    progressBox: Phaser.GameObjects.Graphics | any;
    wallsLayer: Phaser.Tilemaps.StaticTilemapLayer | any;

    switcher: SceneSwitcher;

    constructor(switcher: SceneSwitcher) {
        super('battlezone');
        this.switcher = switcher;
    }

    preload() {

    }


    create() {

        this.bulletsGroup = this.add.group();
        this.monstersGroup = this.add.group();
        this.monsterBulletGroup = this.add.group();
        this.turretsGroup = this.add.group();

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

        //new HeadUpDisplay(this, 0, 0);

        //test
        new Gumball(this, [1250, 300]);
        new Turret(this, [1300, 300], TurretType.Small);

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

    }

    update(time: any, delta: any) {


    }

    scanMonsterPosition(position: [number, number], radius: number)
        : [number, number] | undefined {
        let monsters: Array<Phaser.GameObjects.Sprite>
            = this.monstersGroup.getChildren();

        for (let monster of monsters) {
            let deltaX = position[0] - monster.x;
            let deltaY = position[1] - monster.y;
            let distance = Math.abs(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
            if (distance <= radius) {
                return [monster.x, monster.y];
            }
        }

        return undefined;
    }
}

export {BattlezoneScene as default};