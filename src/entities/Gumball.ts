import 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import Monster from './Monster';
import Bullet from './Bullet';
import BattlezoneScene from '../BattlezoneScene';
import State from '../utils/MonsterState';

class Gumball extends Monster {
    target: Sprite;
    damageTimer: number;
    attackTimer: number;

    constructor(scene: BattlezoneScene, spawnPoint: [number, number]) {
        super(scene, spawnPoint, 'gumball', 80, 70);

        this.target = (scene.tooth as Sprite);
        this.damageTimer = 0;
        this.attackTimer = Date.now();
        this.anims.play('gumball-left', true);

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
            if (this.isWithinShootingRange(this.target)) {
                this.attack([this.target.x, this.target.y]);
            }

            if (!this.isWithinFollowingRange(this.target)) {
                this.target = (this.scene.tooth as Sprite);
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

    isWithinShootingRange(target: Sprite) {
        let delta = [
            target.x - this.x,
            target.y - this.y
        ];
        let distance = Math.abs(Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]));

        if (distance < 400) {
            return true;
        }

        return false;
    }

    moveTowards(target: Sprite) {
        super.moveTowards(target);
        if (this.body.velocity.x >= 0) {
            this.anims.play('gumball-right', true);
        }
        else {
            this.anims.play('gumball-left', true);
        }
    }


    damage(hitPoint: number, attacker: Sprite) {
        this.target = attacker;
        this.state = State.Damaged;
        this.damageTimer = 0;
        super.damage(hitPoint, attacker);
    }

    destroy() {
        let emitter = this.scene.add.particles('gumball_die').createEmitter({
            speed: {min: -100, max: 100},
            frame: [0, 1, 2],
            lifespan: 600
        });
        emitter.explode(12, this.x, this.y);
        this.scene.events.emit('player.earn', 80);
        super.destroy();
    }

    attack(target: [number, number]) {
        if (Date.now() < this.attackTimer) {
            return;
        }

        let x = target[0] - this.x;
        let y = target[1] - this.y;
        let angle = Math.atan2(y, x);

        let b = new Bullet(this.scene, [this.x, this.y], angle, this);
        this.attackTimer = Date.now() + 1 * 1000;
        this.scene.sound.play('player_shoot_sfx');
    }
}

export default Gumball;
