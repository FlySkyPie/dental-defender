import 'phaser';
import Team from './utils/Team';
import BattlezoneScene from './BattlezoneScene';
import Player from './Player';

import Sprite = Phaser.GameObjects.Sprite;
import Group = Phaser.GameObjects.Group;

class Bullet extends Sprite {
    scene: BattlezoneScene;
    host: Player;
    speed: number;
    life: number;
    constructor(scene: BattlezoneScene,
        spawnPoint: [number, number],
        direction: number, host: Player) {
        super(scene, spawnPoint[0], spawnPoint[1], 'bullet');
        this.scene = scene;
        this.scene.add.existing(this);

        if (host.team === Team.Red) {
            this.setTexture('bullet');
        } else {
            this.setTexture('bullet_pink');
        }
        this.life = 75;
        this.host = host;

        this.scene.physics.add.existing(this);
        this.speed = 550;
        this.body.velocity.x = Math.cos(direction) * this.speed;
        this.body.velocity.y = Math.sin(direction) * this.speed;
        (this.scene.bulletsGroup as Group).add(this);

        this.scene.events.on('update', () => {
            this.update()
        });
    }
    update() {
        super.update();
        this.life--;

        if (this.life <= 0) {
            this.destroy();
        }
    }
}

export {Bullet as default};