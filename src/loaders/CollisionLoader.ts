import 'phaser';
import Scene = Phaser.Scene;
import TilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import Group = Phaser.GameObjects.Group;
import GameObject = Phaser.GameObjects.GameObject;

import Player from '../entities/Player';
import Corn from '../entities/Corn';
import Mint from '../entities/Mint';
import Monster from '../entities/Monster';
import Tooth from '../entities/Tooth';
import Turret from '../entities/Turret'
import Bullet from '../entities/Bullet';
import Cursor from '../entities/Cursor';

class CollisionLoader {
    scene: Scene;
    wallsLayer: TilemapLayer | undefined;
    playersGroup: Group | undefined;
    teethGroup: Group | undefined;
    monstersGroup: Group | undefined;
    turretsGroup: Group | undefined;
    bulletsGroup: Group | undefined;
    monsterBulletGroup: Group | undefined;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    addPlayersGroup(playerGroup: Group) {
        this.playersGroup = playerGroup;
        return this;
    }

    addTeethGroup(teethGroup: Group) {
        this.teethGroup = teethGroup;
        return this;
    }

    addWallsLayer(wallsLayer: TilemapLayer) {
        this.wallsLayer = wallsLayer;
        return this;
    }

    addMonstersGroup(monstersGroup: Group) {
        this.monstersGroup = monstersGroup;
        return this;
    }
    addTurretsGroup(turretsGroup: Group) {
        this.turretsGroup = turretsGroup;
        return this;
    }
    addBulletsGroup(bulletsGroup: Group) {
        this.bulletsGroup = bulletsGroup;
        return this;
    }
    addMonsterBulletGroup(monsterBulletGroup: Group) {
        this.monsterBulletGroup = monsterBulletGroup;
        return this;
    }

    load() {
        if (this.playersGroup === undefined
            || this.wallsLayer === undefined
            || this.turretsGroup === undefined
            || this.monstersGroup === undefined
            || this.bulletsGroup === undefined
            || this.monsterBulletGroup === undefined
            || this.teethGroup === undefined) {
            return;
        }
        this.scene.physics.add.collider(this.playersGroup, this.wallsLayer);
        this.scene.physics.add.collider(this.monstersGroup, this.wallsLayer);
        this.scene.physics.add.collider(this.playersGroup, this.turretsGroup);
        this.scene.physics.add.collider(this.monstersGroup, this.turretsGroup,
            (monster: any, tooth: any) => {
                if (monster instanceof Corn) {
                    tooth.damage(30);
                    monster.destroy();
                } else if (monster instanceof Mint) {
                    tooth.damage(20);
                    monster.destroy();
                }
            });
        this.scene.physics.add.collider(this.playersGroup, this.teethGroup);
        this.scene.physics.add.collider(this.monstersGroup, this.playersGroup,
            (monster: any, player: any) => {
                if (monster instanceof Corn) {
                    (player as Player).damage(20);
                    monster.destroy();
                } else if (monster instanceof Mint) {
                    (player as Player).damage(10);
                    monster.destroy();
                }
            });
        this.scene.physics.add.collider(this.monstersGroup, this.turretsGroup,
            (monster: any | Monster, turret: any) => {
                if (monster instanceof Corn) {
                    (turret as Turret).damage(20);
                    monster.destroy();
                } else if (monster instanceof Mint) {
                    (turret as Turret).damage(10);
                    monster.destroy();
                }
            });
        this.scene.physics.add.collider(this.bulletsGroup, this.wallsLayer,
            (bullet: any) => {
                (bullet as Bullet).destroy()
            });
        this.scene.physics.add.overlap(this.bulletsGroup, this.teethGroup,
            (bullet: any) => {
                (bullet as Bullet).destroy();
            });
        this.scene.physics.add.overlap(this.bulletsGroup, this.monstersGroup,
            (bullet: any, monster: any) => {
                monster.damage(bullet.host.attackDamage, bullet.host);
                (bullet as Bullet).destroy();
            });
        this.scene.physics.add.overlap(this.monsterBulletGroup, this.turretsGroup,
            (bullet: any, turret: any) => {
                turret.damage(5);
                (bullet as Bullet).destroy();
            });
        this.scene.physics.add.collider(this.monstersGroup, this.teethGroup, (monster: any, tooth: any) => {
            if (monster instanceof Corn) {
                tooth.damage(30);
                monster.destroy();
            } else if (monster instanceof Mint) {
                tooth.damage(20);
                monster.destroy();
            }
        });
        this.scene.physics.add.collider(this.monsterBulletGroup, this.wallsLayer,
            (bullet: any) => {
                (bullet as Bullet).destroy();
            });
        this.scene.physics.add.overlap(this.monsterBulletGroup, this.teethGroup,
            (bullet: any, tooth: any) => {
                tooth.damage(10);
                (bullet as Bullet).destroy();
            });
        this.scene.physics.add.overlap(this.monsterBulletGroup, this.playersGroup,
            (bullet: any, player: any) => {
                player.damage(10);
                (bullet as Bullet).destroy();
            });
    }

    addCursor(cursor: Cursor) {
        if (this.playersGroup === undefined
            || this.turretsGroup === undefined
            || this.monstersGroup === undefined
            || this.bulletsGroup === undefined
            || this.monsterBulletGroup === undefined
            || this.teethGroup === undefined) {
            return;
        }
        
        this.scene.physics.add.overlap(cursor, this.playersGroup);
        this.scene.physics.add.overlap(cursor, this.turretsGroup);
        this.scene.physics.add.overlap(cursor, this.monstersGroup);
        this.scene.physics.add.overlap(cursor, this.bulletsGroup);
        this.scene.physics.add.overlap(cursor, this.monsterBulletGroup);
        this.scene.physics.add.overlap(cursor, this.teethGroup);
    }
}

export default CollisionLoader;