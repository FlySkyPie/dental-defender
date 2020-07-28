import 'phaser';
import SceneSwitcher from '../interfaces/SceneSwitcher';
import BalanceMonitor from '../interfaces/BalanceMonitor'
import CharacterMonitor from '../interfaces/CharacterMonitor';

class HUDScene extends Phaser.Scene implements BalanceMonitor, CharacterMonitor {
    private switcher: SceneSwitcher;
    healthText: Phaser.GameObjects.Text | undefined;
    moneyText: Phaser.GameObjects.Text | undefined;
    slotTexts: Array<Phaser.GameObjects.Text>;
    arrowImage: Phaser.GameObjects.Image | undefined;

    selectedSlotIndex: number;
    constructor(switcher: SceneSwitcher) {
        super('hud-scene');
        this.switcher = switcher;
        this.slotTexts = []
        this.selectedSlotIndex = 0;
    }

    preload() {

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
        this.updateStock([0, 0, 0]);
        this.scene.sleep();
        this.switcher.reportStandby(this);
    }

    updateHealth(health: number, healthMax: number) {
        if (this.healthText === undefined) {
            return;
        }
        let healthRatio = Math.floor((health / healthMax) * 100);
        this.healthText.setText("Health: " + healthRatio + "%");
    }

    updateSelectedItem(index: number): void {
        if (this.arrowImage === undefined) {
            return;
        }
        this.arrowImage.y = 22 + (index * 5) + (index * 32);

    }
    updateMoney(value: number): void {
        if (this.moneyText === undefined) {
            return;
        }
        this.moneyText.setText("Money: " + value.toString());
    }

    updateStock(amounts: [number, number, number]): void {
        for (let i = 0; i < 3; i++) {
            this.slotTexts[i + 1].setText(amounts[i].toString());
        }
    }
}

export default HUDScene;