import MonsterType from './utils/MonsterType';

class MonsterInventory {
    stock: [number, number, number];
    destoryed: [number, number, number];
    goal: [number, number, number];
    constructor() {
        this.stock = [0, 0, 0];
        this.destoryed = [0, 0, 0];
        this.goal = [0, 0, 0];
    }

    public init(config: [number, number, number]) {
        this.stock = [config[0], config[1], config[2]];
        this.goal = [config[0], config[1], config[2]];
        this.destoryed = [0, 0, 0];
    }

    public reportDestoryed(monsterType: MonsterType): void {
        if (monsterType === MonsterType.Corn) {
            this.destoryed[0] += 1;
        } else if (monsterType === MonsterType.Gumball) {
            this.destoryed[1] += 1;
        } else if (monsterType === MonsterType.Mint) {
            this.destoryed[2] += 1;
        }
    }

    public isAchievedGoal(): boolean {
        let value = (this.destoryed[0] === this.goal[0]
            && this.destoryed[1] === this.goal[1]
            && this.destoryed[2] === this.goal[2]);
        return value;
    }

    public getRandMonster(): MonsterType {
        if (this.getTotalStock()===0){
            throw "There not stock monster in the inventory!";
        }
        let straws: Array<MonsterType> = [];
        straws = straws.concat(Array(this.stock[0]).fill(MonsterType.Corn))
            .concat(Array(this.stock[1]).fill(MonsterType.Gumball))
            .concat(Array(this.stock[2]).fill(MonsterType.Mint));

        let rand = Math.floor(Math.random() * straws.length);
        let straw = straws[rand];
        this.shipped(straw);
        return straw;
    }

    private shipped(monsterType: MonsterType) {
        if (monsterType === MonsterType.Corn) {
            this.stock[0] -= 1;
        } else if (monsterType === MonsterType.Gumball) {
            this.stock[1] -= 1;
        } else if (monsterType === MonsterType.Mint) {
            this.stock[2] -= 1;
        }
    }

    public getTotalStock(): number {
        return (this.stock[0] + this.stock[1] + this.stock[2]);
    }
}

export default MonsterInventory;