import 'phaser';
import SceneSwitcher from '../interfaces/SceneSwitcher';

class MenuScene extends Phaser.Scene {
    private switcher: SceneSwitcher;
    music: Phaser.Sound.BaseSound | undefined;
    constructor(switcher: SceneSwitcher) {
        super('main-menu');
        this.switcher = switcher;
    }

    create() {
        this.add.image(0, 0, 'mainmenu_bg').setOrigin(0);

        let startButton = this.add.image(1024 / 2, 600, 'start_btn')
            .setFrame(0).setInteractive();
        startButton.on('pointerdown', () => {
            this.switcher.startBattle();
        });

        startButton.on('pointerover', () => {
            startButton.setFrame(1);
        });
        startButton.on('pointerout', () => {
            startButton.setFrame(0);
        });

        this.music = this.sound.add('game_music', {
            volume: 0.4,
            loop: true,
        });
        this.music.play();
        this.scene.sleep();
        this.switcher.reportStandby(this);
    }
}

export {MenuScene as default};