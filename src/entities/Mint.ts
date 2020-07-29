import 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import Monster from './Monster';
import BattlezoneScene from '../scenes/BattlezoneScene';
import State from '../utils/MonsterState';
import DeathRegistration from '../interfaces/DeathRegistration';

class Mint extends Monster {
    damageTimer: number;

    constructor(scene: BattlezoneScene, spawnPoint: [number, number], reporter: DeathRegistration) {
        super(scene, spawnPoint, 'mint', 20, 200, reporter);

        this.target = (scene.getTooth() as Sprite);
        this.damageTimer = 0;
        this.anims.play('mint-left', true);

        this.scene.events.on('update', () => {
            this.update()
        });
    }

    update() {
        if (!this.isLive) {
            return;
        }
        super.update();

        if (this.state === State.Tracking) {
            if (!this.isWithinFollowingRange(this.target)) {
                this.target = this.primeTarget;
            }
            this.moveTowards(this.target);
        }
        else if (this.state == State.Damaged) {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.damageTimer--;
            if (this.damageTimer <= 0) {
                this.state = State.Tracking;
            }
        }
    }

    moveTowards(target: Sprite) {
        super.moveTowards(target);
        if (this.body.velocity.x >= 0) {
            this.anims.play('mint-right', true);
        }
        else {
            this.anims.play('mint-left', true);
        }
    }


    damage(hitPoint: number, attacker: Sprite) {
        this.state = State.Damaged;
        this.damageTimer = 0;
        super.damage(hitPoint, attacker);
    }

    destroy() {
        let emitter = this.scene.add.particles('mint_die').createEmitter({
            speed: {min: -100, max: 100},
            frame: [0, 1, 2],
            lifespan: 600
        });
        emitter.explode(12, this.x, this.y);
        this.scene.events.emit('player.earn', 50);
        super.destroy();
    }
}

export default Mint;
