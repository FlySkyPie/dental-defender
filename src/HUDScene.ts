import 'phaser';
import Loader from './loaders/ResourcePreloader';
import json from './resources/hud.json';

class HUDScene extends Phaser.Scene {
    healthText: Phaser.GameObjects.Text | undefined;
    moneyText: Phaser.GameObjects.Text | undefined;
    slotTexts: Array<Phaser.GameObjects.Text>;
    arrowImage: Phaser.GameObjects.Image | undefined;

    selectedSlotIndex: number;
    constructor() {
        super('hud-scene');
        this.slotTexts = []
        this.selectedSlotIndex = 0;
    }

    preload() {
        let loader = new Loader(this);
        loader.preload(json);
    }

    create() {
        //top right display
        this.healthText = this.add.text(880, 10, "Health: 100%",
            {font: "18px monospace", color: '#ffffff'});
        this.moneyText = this.add.text(880, 40, "Money: 0",
            {font: "18px monospace", color: '#ffffff'});

        //top left display
        let itemsName = ['gun', 'hammer', 'turret_small', 'turret_big'];
        this.arrowImage = this.add.image(46, 22, 'toolbar_arrow');

        for (let i = 0; i < 4; i++) {
            let slotBackgroundImage = this.add
                .image(22, 22 + (i * 5) + (i * 32), 'toolbar_slot_background');
            let slotImage = this.add
                .image(22, 22 + (i * 5) + (i * 32), itemsName[i] + '_icon');
            let slotText = this.add.text(11, 20 + i * 37, "",
                {font: "12px Arial", color: '#ffffff'});
            this.slotTexts.push(slotText);
        }
        this.updateItemAmount([0, 0, 0]);

        //  Listen for events from it
        this.scene.get('battlezone').events
            .on('hud.selectItem', (value: number) => {
                this.selectItem(value)
            }).on('hud.updateHealth', (health: number, healthMax: number) => {
                this.updateHealth(health, healthMax);
            }).on('hud.updateMoney', (value: number) => {
                this.updateMoney(value);
            }).on('hud.updateItemAmount', (itemAmount: Array<number>) => {
                this.updateItemAmount(itemAmount);
            });
    }

    selectItem(value: number) {
        if (this.arrowImage === undefined) {
            return;
        }
        this.arrowImage.y = 22 + (value * 5) + (value * 32);
    }

    updateHealth(health: number, healthMax: number) {
        if (this.healthText === undefined) {
            return;
        }
        let healthRatio = Math.floor((health / healthMax) * 100);
        this.healthText.setText("Health: " + healthRatio + "%");
    }

    updateMoney(value: number) {
        if (this.moneyText === undefined) {
            return;
        }
        this.moneyText.setText("Money: " + value.toString());
    }

    updateItemAmount(itemAmount: Array<number>) {
        for (let i = 0; i < 3; i++) {
            this.slotTexts[i + 1].setText(itemAmount[i].toString());
        }
    }

}

export default HUDScene;