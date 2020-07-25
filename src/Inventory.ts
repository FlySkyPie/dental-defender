
class Inventory {
    money: number;
    stock: [number, number, number];
    constructor() {
        this.money = 0;
        this.stock = [0, 0, 0,];
    }

    getMoney(): number {
        return this.money;
    }

    addMoney(value: number) {
        this.money += value;
    }

}

export default Inventory;
