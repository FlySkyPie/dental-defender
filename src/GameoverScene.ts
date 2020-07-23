import 'phaser';

class GameoverScene extends Phaser.Scene {
    private isWin: boolean;
    constructor() {
        super('game-over');
        this.isWin = false;
    }

    setResult(value: boolean) {
        this.isWin = value;
    }

    preload() {
        this.load.image('youlose', 'assets/images/youlose.png');
        this.load.image('youwin', 'assets/images/youwin.png');
    }

    create() {
        if (this.isWin) {
            this.add.image(1024 / 2, 768 / 2, 'youwin');
        }
        else {
            this.add.image(1024 / 2, 768 / 2, 'youlose');
        }
    }
}

export {GameoverScene as default};