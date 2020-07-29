import 'phaser';

import Player from '../entities/Player';
import Cursor from '../entities/Cursor';
import Tooth from '../entities/Tooth';
import Corn from '../entities/Corn';
import Mint from '../entities/Mint';
import Gumball from '../entities/Gumball';
import Turret from '../entities/Turret';
import TurretType from '../utils/TurretType';
import AnimationLoader from '../loaders/AnimationLoader';
import CollisionLoader from '../loaders/CollisionLoader';
import SceneSwitcher from '../interfaces/SceneSwitcher';

class BattlezoneScene extends Phaser.Scene {
    map: Phaser.Tilemaps.Tilemap | undefined;
    playersGroup: Phaser.GameObjects.Group | any;
    teethGroup: Phaser.GameObjects.Group | any;
    bulletsGroup: Phaser.GameObjects.Group | any;
    monstersGroup: Phaser.GameObjects.Group | any;
    monsterBulletGroup: Phaser.GameObjects.Group | any;
    turretsGroup: Phaser.GameObjects.Group | any;

    music: Phaser.Sound.WebAudioSound | any;
    progressBar: Phaser.GameObjects.Graphics | any;
    progressBox: Phaser.GameObjects.Graphics | any;
    wallsLayer: Phaser.Tilemaps.StaticTilemapLayer | any;

    switcher: SceneSwitcher;
    collisionLoader: CollisionLoader | undefined;

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
        this.playersGroup = this.add.group();
        this.teethGroup = this.add.group();

        this.map = this.make.tilemap({key: "test3"});
        const tileset = this.map.addTilesetImage("tileset", "tileset-image");
        const groundLayer = this.map.createStaticLayer("ground", tileset, 0, 0);
        this.wallsLayer = this.map.createStaticLayer("walls", tileset, 0, 0);
        this.wallsLayer.setCollisionByProperty({collides: true});
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        let animationLoader = new AnimationLoader();
        animationLoader.load(this);

        let holyTooth = new Tooth(this, [800, 400], this.switcher);

        this.collisionLoader = new CollisionLoader(this);
        this.collisionLoader.addPlayersGroup(this.playersGroup)
            .addWallsLayer(this.wallsLayer)
            .addMonstersGroup(this.monstersGroup)
            .addTurretsGroup(this.turretsGroup)
            .addBulletsGroup(this.bulletsGroup)
            .addMonsterBulletGroup(this.monsterBulletGroup)
            .addTeethGroup(this.teethGroup).load();

        this.scene.sleep();
        this.switcher.reportStandby(this);
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

    createPlayer(): [Player, Cursor] {
        let player = new Player(this, [800, 300],this.switcher);
        const camera = this.cameras.main;
        camera.startFollow(player);
        let bounds = this.physics.world.bounds;
        camera.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
        let cursor = new Cursor(this);
        cursor.setWallLayer(this.wallsLayer);
        this.collisionLoader!.addCursor(cursor);
        return [player, cursor];
    }

    getTooth(): Phaser.GameObjects.Sprite {
        let tooth = (this.teethGroup as Phaser.GameObjects.Group).getFirst(true);
        return tooth;
    }

}

export {BattlezoneScene as default};