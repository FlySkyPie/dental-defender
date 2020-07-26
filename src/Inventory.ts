import 'phaser';
import Item from './utils/Item';

class Inventory extends Phaser.GameObjects.GameObject {
    private money: number;
    private stock: [number, number, number];
    
    constructor(scene: Phaser.Scene) {
        super(scene, 'inventory');
        this.money = 0;
        this.stock = [0, 0, 0];
    }

    getMoney(): number {
        return this.money;
    }

    addMoney(value: number) {
        this.money += value;
        this.scene.events.emit('hud.updateMoney', this.money);
    }

    buyItem(item: Item): boolean {
        if (item === Item.Hammer) {
            return this.buyHammer();
        } else if (item === Item.SmallTurret) {
            return this.buySmallTurret();
        } else if (item === Item.BigTurret) {
            return this.buyBigTurret();
        } else {
            return this.buyAid();
        }
        return false;
    }

    private spendMoney(value: number) {
        if (value > this.money) {
            return false;
        }
        this.money -= value;
        this.scene.events.emit('hud.updateMoney', this.money);
        return true;
    }

    private buyHammer(): boolean {
        if (this.spendMoney(650)) {
            this.stock[0] += 1;
            return true;
        }
        return false;
    }

    private buySmallTurret(): boolean {
        if (this.spendMoney(800)) {
            this.stock[1] += 1;
            return true;
        }
        return false;
    }

    private buyBigTurret(): boolean {
        if (this.spendMoney(1500)) {
            this.stock[2] += 1;
            return true;
        }
        return false;
    }

    /**
     * Aid is not a item, it would been used immediately.
     */
    private buyAid(): boolean {
        if (this.spendMoney(500)) {
            this.scene.events.emit('player.heal', 50);
            return true;
        }
        return false;
    }
}

export default Inventory;
