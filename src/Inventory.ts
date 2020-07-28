import Item from './utils/Item';

class Inventory {
    private money: number;
    private stock: [number, number, number];

    constructor() {
        this.money = 0;
        this.stock = [10, 10, 10];
    }
    
    getStock(){
        return this.stock;
    }

    useItem(item: Item): boolean {
        if (item === Item.Hammer && this.stock[0] > 0) {
            this.stock[0] -= 1;
            return true;
        } else if (item === Item.SmallTurret && this.stock[1] > 0) {
            this.stock[1] -= 1;
            return true;
        } else if (item === Item.BigTurret && this.stock[2] > 0) {
            this.stock[2] -= 1;
            return true;
        }
        return false;
    }

    getMoney(): number {
        return this.money;
    }

    addMoney(value: number) {
        this.money += value;
    }

    buyItem(item: Item): boolean {
        let price = this.getPrice(item);

        if (!this.spendMoney(price)) {
            return false;
        }

        switch (item) {
            case Item.Hammer:
                this.stock[0] += 1;
                break;
            case Item.SmallTurret:
                this.stock[1] += 1;
                break;
            case Item.BigTurret:
                this.stock[2] += 1;
                break;
            default:
                //TODO: heal player
                break;
        }
        return true;
    }

    private getPrice(item: Item) {
        switch (item) {
            case Item.Hammer:
                return 650;
            case Item.SmallTurret:
                return 800;
            case Item.BigTurret:
                return 1500;
            default:
                return 500;
        }
    }

    private spendMoney(value: number) {
        if (value > this.money) {
            return false;
        }
        this.money -= value;
        //TODO: update money display
        return true;
    }
}

export default Inventory;
