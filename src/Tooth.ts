import 'phaser';
import Direction from './Direction';
import Bullet from './Bullet';
import BattlezoneScene from './BattlezoneScene';
import Team from './Team';

class Tooth extends Phaser.GameObjects.Sprite {
    scene: BattlezoneScene;
    health: number;
    healthMax: number;
    healthBar: Phaser.GameObjects.Sprite;

    constructor(scene: BattlezoneScene, spawnPoint: [number, number]) {
        super(scene, spawnPoint[0], spawnPoint[1], 'tooth');
        this.scene = scene;
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);

        this.health = 500;
        this.healthMax = 500;

        this.healthBar = this.scene.add.sprite(this.x, this.y + 40, 'player_health');

        this.scene.events.on('update', () => {
            this.update()
        });
    }

    update() {
        let p = (this.health / this.healthMax);
        p = parseFloat(p.toFixed(1));

        this.healthBar.setFrame(10 - (p * 10));
    }

    /**
     * Game over when the tooth has been destroyed.
     */
    destroy() {
        this.scene.game.scene.start('game-over');
        this.scene.game.scene.sleep('battlezone');
        super.destroy();
    }
}

export default Tooth;
