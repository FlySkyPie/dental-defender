import 'phaser';
import BattlezoneScene from '../scenes/BattlezoneScene';
import Group = Phaser.GameObjects.Group;
import SceneSwitcher from '../interfaces/SceneSwitcher';

class Tooth extends Phaser.GameObjects.Sprite {
    scene: BattlezoneScene;
    health: number;
    healthMax: number;
    healthBar: Phaser.GameObjects.Sprite;
    switcher: SceneSwitcher;
    constructor(scene: BattlezoneScene, spawnPoint: [number, number], switcher: SceneSwitcher) {
        super(scene, spawnPoint[0], spawnPoint[1], 'tooth');
        this.switcher = switcher;
        this.scene = scene;
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        (this.scene.teethGroup as Group).add(this);

        this.health = 500;
        this.healthMax = 500;

        this.healthBar = this.scene.add.sprite(this.x, this.y + 40, 'player_health');

        this.scene.events.on('update', () => {
            this.update()
        });
    }

    damage(hitPoint: number) {
        this.health -= hitPoint;
        if (this.health <= 0) {
            this.destroy();
        }
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
        this.switcher.gameover(false);
        //super.destroy();
    }
}

export default Tooth;
