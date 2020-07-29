import 'phaser';
import Group = Phaser.GameObjects.Group;

import Bullet from './Bullet';
import BattlezoneScene from '../scenes/BattlezoneScene';
import Team from '../utils/Team';
import Direction from '../utils/Direction';
import MainRole from '../interfaces/MainRole';
import SceneSwitcher from '../interfaces/SceneSwitcher';

class Player extends Phaser.GameObjects.Sprite implements MainRole {
    scene: BattlezoneScene;
    speed: number;
    team: Team;

    attackTimer: number;
    attackCoolDown: number;
    health: number;
    healthMax: number;
    attackDamage: number;

    direction: Direction;
    underAttack: boolean;
    underAttackTimer: number;
    
    switcher: SceneSwitcher;

    constructor(scene: BattlezoneScene, spawnPoint: [number, number],switcher: SceneSwitcher) {
        super(scene, spawnPoint[0], spawnPoint[1], 'player');
        this.switcher = switcher;
        this.scene = scene;
        this.scene.add.existing(this);
        this.setSize(36, 36);

        //physic stuff
        this.scene.physics.add.existing(this);
        this.speed = 150;
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        (this.scene.playersGroup as Group).add(this);

        //game stuff
        this.attackTimer = Date.now();
        this.attackCoolDown = 150;
        this.health = 200;
        this.healthMax = 200;
        this.attackDamage = 10;
        this.team = Team.Red;

        //visuolize stuff
        this.direction = Direction.Down;
        this.underAttack = false;
        this.underAttackTimer = Date.now();
        this.anims.play('right', true);

        //this.setActive(true);
        this.scene.events.on('update', () => {
            this.update()
        });
    }


    update() {
        if (this.underAttack
            && Date.now() >= this.underAttackTimer) {
            this.underAttack = false;
        }
        let prefix = (this.direction === Direction.Right) ? 'right' : 'left';

        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            if (this.underAttack) {
                this.anims.play(prefix + '-damaged', true);
            } else {
                this.anims.play(prefix, true);
            }
        } else {
            if (this.underAttack) {
                this.anims.play(prefix + '-idle-damaged');
            } else {
                this.anims.play(prefix + '-idle')
            }
        }
    }

    attack(target: [number, number]): void {
        if (Date.now() < this.attackTimer) {
            return;
        }

        let start_x = this.x;

        if (this.direction === Direction.Left) {
            start_x = this.x - 20;
        } else if (this.direction === Direction.Right) {
            start_x = this.x + 20;
        }

        let x = target[0] - start_x;
        let y = target[1] - this.y;

        let angle = Math.atan2(y, x);

        let b = new Bullet(this.scene, [start_x, this.y + 2], angle, this);
        this.attackTimer = Date.now() + this.attackCoolDown;
        this.scene.sound.play('player_shoot_sfx', {volume: 0.2});
    }

    damage(hitPoint: number) {
        this.scene.sound.play('player_hurt_sfx', {volume: 0.4});
        this.underAttack = true;
        this.underAttackTimer = Date.now() + 500;
        this.health -= hitPoint;
        this.scene.events.emit('hud.updateHealth', this.health, this.healthMax);
        if (this.health <= 0) {
            this.scene.switcher.gameover(false);
            //this.destroy();
        }
    }

    getSpeed() {
        return this.speed;
    }

    setVelocity(value: [number, number]): void {
        this.body.velocity.x = value[0];
        this.body.velocity.y = value[1];
    }

    setDirection(value: Direction): void {
        this.direction = value;
    }

    getPosition(): [number, number] {
        return [this.x, this.y];
    }

    public heal(point: number) {
        this.health += point
        if (this.health > this.healthMax) {
            this.health = this.healthMax;
        }
        this.scene.events.emit('hud.updateHealth', this.health, this.healthMax);
    }
    
    destroy(){
        this.switcher.gameover(false);
    }
}

export {Player as default};