import 'phaser';
import Scene from './BattlezoneScene';
import Container = Phaser.GameObjects.Container;

class HeadUpDisplay extends Container {
    healthText: Phaser.GameObjects.Text;
    moneyText: Phaser.GameObjects.Text;
    scene: Scene;
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        this.scene = scene;

        this.healthText = scene.add.text(880, 10, "Health: 100%",
            {font: "18px monospace", color: '#ffffff'});
        this.moneyText = scene.add.text(880, 40, "Money: 0",
            {font: "18px monospace", color: '#ffffff'});

        this.add(this.healthText);
        this.add(this.moneyText);

        // ...
        scene.add.existing(this);
        this.setScrollFactor(0, 0, true);
        this.scene.events.on('update', () => {
            this.update()
        });
    }

    update() {
        if (this.scene.player !== undefined) {
            let player = this.scene.player;
            let healthRatio = Math.floor((player.health / player.healthMax) * 100);
            this.healthText.setText("Health: " + healthRatio + "%");
            this.moneyText.setText("Money: " + player.inventory.getMoney().toString());
        }

    }
}

export default HeadUpDisplay;
