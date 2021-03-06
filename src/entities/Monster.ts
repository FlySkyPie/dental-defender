import 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import Group = Phaser.GameObjects.Group;
import BattlezoneScene from '../scenes/BattlezoneScene';
import Player from './Player';
import Team from '../utils/Team';
import State from '../utils/MonsterState';
import DeathRegistration from '../interfaces/DeathRegistration';
import FinancialBody from '../interfaces/FinancialBody';

abstract class Monster extends Sprite {
    scene: BattlezoneScene;
    primeTarget: Sprite;
    target: Sprite;
    financialBody: FinancialBody;
    health: number;
    healthMax: number;
    speed: number;
    healthBar: Sprite;
    team: Team;
    state: State;
    isLive: boolean;
    reporter: DeathRegistration;

    bonus: number;

    constructor(scene: BattlezoneScene, spawnPoint: [number, number],
        imageKey: string, health: number, speed: number, reporter: DeathRegistration,
        financialBody: FinancialBody) {
        super(scene, spawnPoint[0], spawnPoint[1], imageKey);
        this.reporter = reporter;
        this.target = this.primeTarget = scene.getTooth();
        this.financialBody = financialBody;
        this.scene = scene;
        this.scene.add.existing(this);

        this.health = this.healthMax = health;
        this.isLive = true;
        this.team = Team.Blue;
        this.state = State.Tracking;
        this.healthBar = this.scene.add.sprite(this.x, this.y + 20, 'turret_health_bar');
        this.bonus = 0;

        //physic stuff
        this.scene.physics.add.existing(this);
        this.speed = speed;
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        (this.scene.monstersGroup as Group).add(this);
    }

    update() {
        this.updateHealthBar();
    }

    public setTarget(target: Sprite) {
        this.target = target;
    }


    protected isWithinFollowingRange(target: Sprite) {
        let delta = [
            target.x - this.x,
            target.y - this.y
        ];
        let distance = Math.abs(Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]));

        if (distance < 300) {
            return true;
        }

        return false;
    }

    moveTowards(target: Sprite) {
        let x = target.x - this.x;
        let y = target.y - this.y;
        let mag = Math.sqrt((x * x) + (y * y));
        let unitVector = [x / mag, y / mag];

        this.body.velocity.x = unitVector[0] * this.speed;
        this.body.velocity.y = unitVector[1] * this.speed;
    }

    damage(hitPoint: number, attacker: Sprite) {
        this.health -= hitPoint;
        if (this.health <= 0) {
            //TODO: player get money or score.
            this.financialBody.earn(this.bonus);
            this.destroy();
        }
    }


    updateHealthBar() {

        this.healthBar.x = this.x;
        this.healthBar.y = this.y + 24;

        let healthRatio = ((this.health < 0 ? 0 : this.health) / this.healthMax);
        healthRatio = parseFloat(healthRatio.toFixed(1));
        this.healthBar.setFrame(10 - (healthRatio * 10));
    }

    destroy() {
        this.isLive = false;
        this.reporter.reportDestroyed(this);
        this.scene.sound.play('baddie_die_sfx', {volume: 0.1});
        this.healthBar.destroy();
        super.destroy();
    }

}

export default Monster;