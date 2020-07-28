import 'phaser';
//import Scene = Phaser.Scene;
import Scene from './scenes/BattlezoneScene';
import Inventory from './Inventory';
import MainRole from './interfaces/MainRole';
import Monitor from './GameMonitor';
import Direction from './utils/Direction'
import Cursor from './entities/Cursor';
import Item from './utils/Item';
import Turret from './entities/Turret';
import TurretType from './utils/TurretType';

class PlayerController {
    scene: Scene;
    player: MainRole;
    monitor: Monitor;
    inventory: Inventory;
    cursor: Cursor;
    itemSelected: Item;
    constructor(scene: Scene, player: MainRole, monitor: Monitor, cursor: Cursor) {
        this.scene = scene;
        this.player = player;
        this.monitor = monitor;
        this.inventory = new Inventory()
        this.cursor = cursor;
        this.itemSelected = Item.Gun;

        this.monitor.updateStock(this.inventory.getStock());

        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE).on('down', () => {
            this.monitor.updateSelectedItem(0);
            this.cursor.setMode('gun_cursor');
            this.itemSelected = Item.Gun;
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO).on('down', () => {
            this.monitor.updateSelectedItem(1);
            this.cursor.setMode('hammer');
            this.itemSelected = Item.Hammer;
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE).on('down', () => {
            this.monitor.updateSelectedItem(2);
            this.cursor.setMode('turret_small');
            this.itemSelected = Item.SmallTurret;
        });
        scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR).on('down', () => {
            this.monitor.updateSelectedItem(3);
            this.cursor.setMode('turret_big');
            this.itemSelected = Item.BigTurret;
        });

        scene.input.on('pointerup', () => {
            let item = (this.itemSelected as Item);
            let used = false;
            if (item === Item.Gun) {
                return;
            }
            if (item === Item.Hammer && this.isWithinReach()
                && this.cursor.getLastCollided() instanceof Turret) {
                used = this.inventory.useItem(item);
                if (used) {
                    (this.cursor.getLastCollided() as Turret).fix();
                }
            } else {
                if (this.cursor.isCollided() || !this.isWithinReach()) {
                    return;
                }
                used = this.inventory.useItem(item);
                if (used) {
                    let position: [number, number] = [this.cursor.x, this.cursor.y];
                    if (item === Item.SmallTurret) {
                        new Turret(this.scene, position, TurretType.Small);
                    } else if (item === Item.BigTurret) {
                        new Turret(this.scene, position, TurretType.Big);
                    }
                }
            }

            if (used) {
                this.monitor.updateStock(this.inventory.getStock());
            }
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

        if (this.scene.input.mousePointer.isDown && this.itemSelected === Item.Gun) {
            let x = this.cursor.x;
            let y = this.cursor.y;
            this.player.attack([x, y]);
        }

        //update cursor texture
        if (this.itemSelected !== Item.Gun) {
            let isDenied = (this.cursor.isCollided() || !this.isWithinReach());
            this.cursor.updateTexture(isDenied);
        }
    }

    private isWithinReach(): boolean {
        let position = this.player.getPosition();
        let deltaX = position[0] - this.cursor.x;
        let deltaY = position[1] - this.cursor.y;
        let distence = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        return (distence <= 200) ? true : false;
    }



}

export default PlayerController;