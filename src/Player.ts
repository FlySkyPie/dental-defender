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
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

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
        this.scene.events.on('update', () => {
            this.update()
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
        }
        else if (keyDown.isDown) {
            this.body.velocity.y = this.speed;
        }
        else {
            this.body.velocity.y = 0;
        }

        if (keyLeft.isDown) {
            this.body.velocity.x = -this.speed;
        }
        else if (keyRight.isDown) {
            this.body.velocity.x = this.speed;
        }
        else {
            this.body.velocity.x = 0;
        }

        var dist = this.scene.input.mousePointer.worldX - this.x;

        if (dist >= 0) {
            this.direction = Direction.Right;
        }
        else {
            this.direction = Direction.Left;
        }
        let prefix= (this.direction === Direction.Right) ? 'right' : 'left';

        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            if (this.underAttack) {
                this.anims.play(prefix+ '-damaged',true);
            }
            else {
                this.anims.play(prefix,true);
            }
        }
        else {
            if (this.underAttack) {
                this.anims.play(prefix+ '-idle-damaged');
            }
            else {
                this.anims.play(prefix+ '-idle')
            }
        }
    }

    attack(target: [number, number]) {

    }
}

export {Player as default};