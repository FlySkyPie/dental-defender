import 'phaser';
import Scene = Phaser.Scene;
import Inventory from './Inventory';
import MainRole from './interfaces/MainRole';
import Monitor from './GameMonitor';
import Direction from './utils/Direction'
import Cursor from './entities/Cursor';

class PlayerController {
    scene: Scene;
    player: MainRole;
    monitor: Monitor;
    inventory: Inventory;
    cursor: Cursor;
    constructor(scene: Scene, player: MainRole, monitor: Monitor) {
        this.scene = scene;
        this.player = player;
        this.monitor = monitor;
        this.inventory = new Inventory()
        this.cursor = new Cursor(scene);

        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE).on('down', () => {
            this.monitor.updateSelectedItem(0);
            this.cursor.setTexture('gun_cursor')
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO).on('down', () => {
            this.monitor.updateSelectedItem(1);
            this.cursor.setTexture('hammer')
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE).on('down', () => {
            this.monitor.updateSelectedItem(2);
            this.cursor.setTexture('turret_small')
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR).on('down', () => {
            this.monitor.updateSelectedItem(3);
            this.cursor.setTexture('turret_big')
        });
    }

    start() {
        this.scene.events.on('update', () => {
            this.update()
        });
    }

    update() {
        //keyboard
        let keyUp = this.scene.input.keyboard.addKey('W');  // Get key object
        let keyDown = this.scene.input.keyboard.addKey('S');  // Get key object
        let keyRight = this.scene.input.keyboard.addKey('D');  // Get key object
        let keyLeft = this.scene.input.keyboard.addKey('A');  // Get key object

        let velocity = [0, 0];
        let speed = this.player.getSpeed();

        if (keyUp.isDown) {
            velocity[1] = -speed;
        } else if (keyDown.isDown) {
            velocity[1] = speed;
        } else {
            velocity[1] = 0;
        }

        if (keyLeft.isDown) {
            velocity[0] = -speed;
        } else if (keyRight.isDown) {
            velocity[0] = speed;
        } else {
            velocity[0] = 0;
        }

        //mouse
        this.player.setVelocity(velocity as [number, number]);
        let position = this.player.getPosition();
        let dist = this.scene.input.mousePointer.worldX - position[0];

        if (dist >= 0) {
            this.player.setDirection(Direction.Right)
        } else {
            this.player.setDirection(Direction.Left)
        }

        if (this.scene.input.mousePointer.isDown) {
            let x = this.cursor.x;
            let y = this.cursor.y;
            this.player.attack([x, y]);
        }
    }


}

export default PlayerController;