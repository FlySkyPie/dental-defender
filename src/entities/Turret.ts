import 'phaser';
import BattlezoneScene from '../BattlezoneScene';
import TurretType from '../utils/TurretType';
import Team from '../utils/Team';
import Direction from '../utils/Direction';
import Bullet from './Bullet';

class Turret extends Phaser.GameObjects.Sprite {
    scene: BattlezoneScene;
    healthBar: Phaser.GameObjects.Sprite | undefined;
    progressBar: Phaser.GameObjects.Sprite;
    team: Team;
    isSetup: boolean;
    turretType: TurretType;
    isLive:boolean;

    setupTimeMax: number;
    setupTime: number;

    attackTimer: number;
    attackCooldown: number;
    health: number;
    healthMax: number;
    attackDamage: number;

    scoutRange: number;

    direction: Direction;

    constructor(scene: BattlezoneScene, spawnPoint: [number, number], turretType: TurretType) {
        super(scene, spawnPoint[0], spawnPoint[1], 'turret');
        this.scene = scene;
        this.scene.add.existing(this);

        this.team = Team.Red;
        this.turretType = turretType;
        this.attackTimer = Date.now();
        this.isSetup = false;
        this.direction = Direction.Right;
        this.isLive = true;

        if (turretType === TurretType.Small) {
            this.setTexture('turret_small');
            this.setupTimeMax = 300;
            this.setupTime = 300;
            this.health = 200;
            this.healthMax = 200;
            this.name = "turret1";
            this.scoutRange = 500;
            this.attackCooldown = .5 * 1000;
            this.attackDamage = 5;
            this.progressBar = this.scene.add.sprite(this.x, this.y - 20, 'turret_progress');
        } else {
            this.setTexture('turret_big');
            this.setupTimeMax = 600;
            this.setupTime = 600;
            this.health = 300;
            this.healthMax = 300;
            this.name = "turret2";
            this.scoutRange = 300;
            this.attackCooldown = 2 * 1000;
            this.attackDamage = 8;
            this.progressBar = this.scene.add.sprite(this.x, this.y - 20, 'turret_progress');
        }

        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        this.scene.turretsGroup.add(this);


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
        if (!this.isLive) {
            return;
        }

        if (!this.isSetup) {
            this.setupTime--;
            if (this.setupTime <= 0) {
                this.isSetup = true;
                this.progressBar.destroy();
                if (this.turretType === TurretType.Small) {
                    this.healthBar = this.scene.add.sprite(this.x, this.y + 20, 'turret_health_bar');
                } else {
                    this.healthBar = this.scene.add.sprite(this.x, this.y + 34, 'turret_health_bar');
                }
            } else {

                var p = 1 - (this.setupTime / this.setupTimeMax);
                if (p > .9) {
                    this.progressBar.setFrame(3);
                } else if (p > .7) {
                    this.progressBar.setFrame(2);
                } else if (p > .4) {
                    this.progressBar.setFrame(1);
                } else {
                    this.progressBar.setFrame(0);
                }
            }
        }
        else {
            this.updateHealthBar();

            //shoot?
            let targetPosition = this.scene.scanMonsterPosition([this.x, this.y], this.scoutRange);
            if (targetPosition !== undefined) {
                this.attack(targetPosition);
            }
        }
    }

    attack(target: [number, number]) {
        if (Date.now() < this.attackTimer) {
            return;
        }
        let relativelX = target[0] - this.x;
        let relativelY = target[1] - this.y;
        let angle = Math.atan2(relativelY, relativelX) / Math.PI * 180;

        let fixedTarget = [relativelX, relativelY];
        let firePosition: [number, number] = [this.x, this.y];

        let shift = (this.turretType === TurretType.Small) ? 16 : 32;

        if (angle <= 45 || angle > 315) {   //right
            fixedTarget[0] -= shift;
            firePosition[0] += shift;
            this.setFrame(0);
        } else if (angle <= 135) {  //up
            fixedTarget[1] += shift;
            firePosition[1] -= shift;
            this.setFrame(1);
        } else if (angle <= 225) {  //left
            fixedTarget[0] += shift;
            firePosition[0] -= shift;
            this.setFrame(2);
        } else {                    //down
            fixedTarget[1] -= shift;
            firePosition[1] += shift;
            this.setFrame(3);
        }

        let bulletAngle = Math.atan2(fixedTarget[1], fixedTarget[0]);
        if (this.turretType === TurretType.Small) {
            let b = new Bullet(this.scene, firePosition, bulletAngle, this);
        } else {
            new Bullet(this.scene, firePosition, bulletAngle, this);
            new Bullet(this.scene, firePosition, bulletAngle + Math.PI / 12, this);
            new Bullet(this.scene, firePosition, bulletAngle - Math.PI / 12, this);
        }


        this.attackTimer = Date.now() + this.attackCooldown;
        this.scene.sound.play('player_shoot_sfx');
    }

    /**
     * Game over when the tooth has been destroyed.
     */
    destroy() {
        this.scene.game.scene.start('game-over');
        this.scene.game.scene.sleep('battlezone');
        super.destroy();
    }

    updateHealthBar() {
        if (this.healthBar === undefined) {
            return;
        }
        let healthRatio = (this.health / this.healthMax);
        healthRatio = parseFloat(healthRatio.toFixed(1));

        this.healthBar.setFrame(10 - (healthRatio * 10));
    }
}

export default Turret;
