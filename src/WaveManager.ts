import Scene from './scenes/BattlezoneScene';
import SceneSwitcher from './interfaces/SceneSwitcher'
import Monster from './entities/Monster';
import Corn from './entities/Corn';
import Gumball from './entities/Gumball';
import Mint from './entities/Mint';

import Inventory from './MonsterInventory';
import MonsterType from './utils/MonsterType';
import DeathRegistration from './interfaces/DeathRegistration'
import FinancialBody from './interfaces/FinancialBody'

import json from './data/waves.json';

enum State {
    PAUSED,
    COUNTDOWN,
    SPAWNING
}

class WaveManager implements DeathRegistration {
    scene: Scene;
    switcher: SceneSwitcher;
    financialBody: FinancialBody | undefined;
    currentWave: number;
    state: State;
    countDown: number;

    monsterMax: number;
    currentMonster: number;

    inventory: Inventory;

    totalWave: number;
    constructor(scene: Scene, switcher: SceneSwitcher) {
        this.scene = scene;
        this.switcher = switcher;
        this.inventory = new Inventory();
        this.currentWave = 0;

        this.monsterMax = 0;
        this.currentMonster = 0;

        this.state = State.PAUSED;
        this.countDown = 3 * 100;
        this.totalWave = json.length;
    }

    public start() {
        this.scene.events.on('update', () => {
            this.update()
        });
        this.startBattle();
    }


    public update() {
        if (this.state === State.COUNTDOWN) {
            this.countDown--;
            if (this.countDown <= 0) {
                this.countDown = 300;
                this.startWave();
            }
        }
    }

    public startBattle() {
        console.log('Wave ' + (this.currentWave + 1) + " going start...")
        this.state = State.COUNTDOWN;
        let config = json[this.currentWave];
        this.inventory.init([config.corn, config.gumball, config.mint]);
        this.monsterMax = config.moment;
    }

    public reportDestroyed(monster: Monster) {
        if (monster instanceof Corn) {
            this.inventory.reportDestoryed(MonsterType.Corn);
        } else if (monster instanceof Gumball) {
            this.inventory.reportDestoryed(MonsterType.Gumball);
        } else if (monster instanceof Mint) {
            this.inventory.reportDestoryed(MonsterType.Mint);
        } else {
            return;
        }
        this.currentMonster -= 1;

        if (this.inventory.isAchievedGoal()) {
            this.leaveBattle();
            return;
        }

        this.sendMonsters();
    }

    public setFinancialBody(body: FinancialBody) {
        this.financialBody = body;
    }

    private startWave() {
        this.state = State.SPAWNING;
        this.sendMonsters();
    }

    private leaveBattle() {
        this.currentWave += 1;
        if (this.currentWave === this.totalWave) {
            this.switcher.gameover(true);
        } else {
            this.switcher.goShop();
        }

        this.state = State.PAUSED;
    }

    private sendMonsters() {
        let newSendMonster = Math.min(
            (this.monsterMax - this.currentMonster),
            this.inventory.getTotalStock()
        );
        
        if (this.financialBody === undefined){
            throw 'financialBody undefinded';
        }

        for (let i = 0; i < newSendMonster; i++) {
            let monster = this.inventory.getRandMonster();
            let position = this.getRandomSpawnPosition();
            this.currentMonster += 1;
            if (monster === MonsterType.Corn) {
                new Corn(this.scene, position, this,this.financialBody);
            } else if (monster === MonsterType.Gumball) {
                new Gumball(this.scene, position, this,this.financialBody);
            } else {
                new Mint(this.scene, position, this,this.financialBody);
            }
        }
    }

    private getRandomSpawnPosition(): [number, number] {
        let rand = [Math.random(), Math.random()];
        if (rand[0] >= 0.5) {
            //top or bottom
            let randX = Math.floor(Math.random() * 1600);
            return (rand[1] >= 0.5) ? [randX, 0] : [randX, 800];
        } else {
            //left or right
            let randY = Math.floor(Math.random() * 800);
            return (rand[1] >= 0.5) ? [0, randY] : [1600, randY];
        }
    }
}

export default WaveManager;