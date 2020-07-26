import 'phaser';

class MainMenuScene extends Phaser.Scene {
    music: any;
    constructor() {
        super('main-menu');
    }

    preload() {
        this.load.image('mainmenu_bg', 'assets/images/mainmenu_bg.png');
        this.load.spritesheet('start_btn', 'assets/spritesheets/start_btn.png',
            {frameWidth: 288, frameHeight: 71});
        this.load.audio('game_music', 'assets/audio/spiff_tune_hazard.mp3');
    }


    create() {
        this.add.image(0, 0, 'mainmenu_bg').setOrigin(0);

        let startButton = this.add.image(1024 / 2 , 600, 'start_btn')
            .setFrame(0).setInteractive();
        startButton.on('pointerdown', () => {
            this.game.scene.start('battlezone');
            this.game.scene.start('hud-scene');
            this.game.scene.stop('main-menu');
            this.music.stop();
        });

        startButton.on('pointerover', () => {
            startButton.setFrame(1);
        });
        startButton.on('pointerout', () => {
            startButton.setFrame(0);
        });

        this.music = this.sound.add('game_music');
        this.music.play();
    }
}

export {MainMenuScene as default};