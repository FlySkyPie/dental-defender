import 'phaser';

import Bullet from './Bullet';
import BattlezoneScene from '../BattlezoneScene';
import Team from '../utils/Team';
import Direction from '../utils/Direction';
import Item from '../utils/Item';
import Inventory from '../Inventory';

class Player extends Phaser.GameObjects.Sprite {
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

    inventory: Inventory;

    constructor(scene: BattlezoneScene, spawnPoint: [number, number]) {
        super(scene, spawnPoint[0], spawnPoint[1], 'player');
        this.scene = scene;
        this.scene.add.existing(this);
        this.setSize(36, 36);

        //physic stuff
        this.scene.physics.add.existing(this);
        this.speed = 150;
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        //game stuff
        this.attackTimer = Date.now();
        this.attackCoolDown = 150;
        this.health = 200;
        this.healthMax = 200;
        this.attackDamage = 10;
        this.team = Team.Red;
        this.inventory = new Inventory(scene);

        //visuolize stuff
        this.direction = Direction.Down;
        this.underAttack = false;
        this.underAttackTimer = Date.now();
        this.anims.play('right', true);

        //CollisionManager.addObjectToGroup(this, 'players');
        this.scene.events.on('update', () => {
            this.update()
        });

        //listen key events
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE).on('down', () => {
            this.scene.events.emit('hud.selectItem', 0);
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO).on('down', () => {
            this.scene.events.emit('hud.selectItem', 1);
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE).on('down', () => {
            this.scene.events.emit('hud.selectItem', 2);
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR).on('down', () => {
            this.scene.events.emit('hud.selectItem', 3);
        });

        //  Listen for events from it
        this.scene.scene.get('battlezone').events
            .on('player.earn', (value: number) => {
                this.inventory.addMoney(value);
            }).on('player.buy', (item: Item) => {
                if (this.inventory.buyItem(item)) {


                }
            }).on('player.heal', (point: number) => {
                this.heal(point);
            });
    }


    update() {
        if (this.underAttack
            && Date.now() >= this.underAttackTimer) {

            this.underAttack = false;
        }
        let keyUp = this.scene.input.keyboard.addKey('W');  // Get key object
        let keyDown = this.scene.input.keyboard.addKey('S');  // Get key object
        let keyRight = this.scene.input.keyboard.addKey('D');  // Get key object
        let keyLeft = this.scene.input.keyboard.addKey('A');  // Get key object

        if (keyUp.isDown) {
            this.body.velocity.y = -this.speed;
        } else if (keyDown.isDown) {
            this.body.velocity.y = this.speed;
        } else {
            this.body.velocity.y = 0;
        }

        if (keyLeft.isDown) {
            this.body.velocity.x = -this.speed;
        } else if (keyRight.isDown) {
            this.body.velocity.x = this.speed;
        } else {
            this.body.velocity.x = 0;
        }

        let dist = this.scene.input.mousePointer.worldX - this.x;

        if (dist >= 0) {
            this.direction = Direction.Right;
        } else {
            this.direction = Direction.Left;
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

    attack(target: [number, number]) {
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
        this.scene.sound.play('player_shoot_sfx');
    }

    damage(hitPoint: number) {
        this.scene.sound.play('player_hurt_sfx');
        this.underAttack = true;
        this.underAttackTimer = Date.now() + 500;
        this.health -= hitPoint;
        this.scene.events.emit('hud.updateHealth', this.health, this.healthMax);
        if (this.health <= 0) {
            this.scene.game.scene.start('game-over');
            this.scene.game.scene.sleep('battlezone');
            //this.destroy();
        }
    }

    public heal(point: number) {
        this.health += point
        if (this.health > this.healthMax) {
            this.health = this.healthMax;
        }
        this.scene.events.emit('hud.updateHealth', this.health, this.healthMax);
    }
}

export {Player as default};