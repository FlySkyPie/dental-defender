import 'phaser';
import Loader from './loaders/ResourcePreloader';
import json from './resources/shop.json';
import eventsCenter from './utils/EventsCenter'

class ShopScene extends Phaser.Scene {
    waveTimeText: Phaser.GameObjects.Text | undefined;
    accuracyText: Phaser.GameObjects.Text | undefined;
    moneyText: Phaser.GameObjects.Text | undefined;

    slotTexts: Array<Phaser.GameObjects.Text>;
    constructor() {
        super('shop-scene');
        this.slotTexts = [];
        
        eventsCenter.on('shop.updateMoney', (value: number) => {this.updateMoney(value)});
    }



    preload() {
        let loader = new Loader(this);
        loader.preload(json);
    }

    create() {
        this.add.image(0, 0, 'overlay').setOrigin(0);
        this.add.text(50, 150, "Wave Complete!", {font: "48px monospace", fill: '#ffffff'});
        this.waveTimeText = this.add.text(50, 220, "Time: 0", {font: "24px monospace", fill: '#ffffff'});
        this.accuracyText = this.add.text(50, 270, "Accuracy: 0", {font: "24px monospace", fill: '#ffffff'});
        this.moneyText = this.add.text(640, 80, "Money Available: 0", {font: "22px monospace", fill: '#ffffff'});

        //Hammers
        this.add.image(660, 420, 'toolbar_slot_background');
        this.add.image(660, 420, 'hammer_icon');
        this.slotTexts[0] = this.add.text(650, 420, '0', {font: "12px Arial", fill: '#ffffff'});
        this.add.text(645, 370, "Repair Hammer", {font: "18px monospace", fill: '#ffffff'});
        this.add.text(700, 400, "Repairs one turret", {font: "14px monospace", fill: '#ffffff'});
        this.add.text(700, 415, "to full health", {font: "14px monospace", fill: '#ffffff'});
        this.add.text(700, 440, "Cost: " + "650", {font: "14px monospace", fill: '#ffffff'});
        this.addButton([880, 410], 'buy_btn', () => {
            //TODO: buy hammer
        });


        //Turret small
        this.add.image(660, 200, 'toolbar_slot_background');
        this.add.image(660, 200, 'turret_small_icon');
        this.slotTexts[1] = this.add.text(650, 200, '0', {font: "12px Arial", fill: '#ffffff'}).setOrigin(0);
        this.add.text(645, 150, "Small Turret", {font: "18px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 180, "Range: 500", {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 200, "Damage: 5 (x1)", {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 220, "Cost: " + '800', {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.addButton([880, 190], 'buy_btn', () => {
            //TODO: buy small turret
        });

        //Turret big
        this.add.image(660, 310, 'toolbar_slot_background');
        this.add.image(660, 310, 'turret_big_icon');
        this.slotTexts[2] = this.add.text(650, 310, '0', {font: "12px Arial", fill: '#ffffff'}).setOrigin(0);
        this.add.text(645, 260, "Large Turret", {font: "18px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 290, "Range: 300", {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 310, "Damage: 8 (x3)", {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 330, "Cost: " + '1500', {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.addButton([880, 300], 'buy_btn', () => {
            //TODO: buy big turret
        });

        //First Aid
        this.add.image(660, 530, 'player');
        this.add.text(645, 480, "First Aid", {font: "18px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 510, "Heals the player", {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 525, "for 50 HP", {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.add.text(700, 550, "Cost: " + "500", {font: "14px monospace", fill: '#ffffff'}).setOrigin(0);
        this.addButton([880, 300], 'buy_btn', () => {
            //TODO: buy first aid
        });

        let readyButton = this.addButton([645, 640], 'ready_btn', () => {
            this.scene.sleep();
            this.game.scene.wake('battlezone');
            this.game.scene.wake('hud-scene');
        })
    }

    updateMoney(value: number) {
        if (this.moneyText === undefined) {
            return;
        }
        this.moneyText.setText("Money Available: " + value.toString());
    }

    updateItemAmount(itemAmount: Array<number>) {
        for (let i = 0; i < 3; i++) {
            this.slotTexts[i + 1].setText(itemAmount[i].toString());
        }
    }

    updateStatistics() {

    }

    private addButton(position: [number, number], imageKey: string, callback: () => any) {
        let button = this.add.image(position[0], position[1], imageKey)
            .setOrigin(0).setFrame(0).setInteractive();
        button.on('pointerdown', () => {
            callback();
        });

        button.on('pointerover', () => {
            button.setFrame(1);
        });
        button.on('pointerout', () => {
            button.setFrame(0);
        });
    }
}

export default ShopScene;
