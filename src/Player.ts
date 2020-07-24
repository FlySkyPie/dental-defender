import 'phaser';
import Direction from './Direction';

class Player extends Phaser.GameObjects.Sprite {
    scene: Phaser.Scene;
    speed: number;

    attackTimer: number;
    attackCoolDown: number;
    health: number;
    healthMax: number;
    attackDamage: number;

    direction: Direction;
    underAttack: boolean;
    underAttackTimer: number;

    constructor(scene: Phaser.Scene, spawnPoint: [number, number]) {
        super(scene, spawnPoint[0], spawnPoint[1], 'Player');
        this.scene = scene;
        this.scene.add.existing(this);
        this.setSize(36, 36);

        //physic stuff
        this.scene.physics.add.existing(this);
        this.speed = 150;
        //(this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        //game stuff
        this.attackTimer = Date.now();
        this.attackCoolDown = 150;
        this.health = 200;
        this.healthMax = 200;
        this.attackDamage = 10;

        //visuolize stuff
        this.direction = Direction.Down;
        this.underAttack = false;
        this.underAttackTimer = Date.now();
        this.setTexture("player", "right");

        //CollisionManager.addObjectToGroup(this, 'players');
    }
}

export {Player as default};