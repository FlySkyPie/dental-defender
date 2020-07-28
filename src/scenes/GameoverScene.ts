import 'phaser';
import SceneSwitcher from '../interfaces/SceneSwitcher';

class GameoverScene extends Phaser.Scene {
    private switcher: SceneSwitcher;

    constructor(switcher: SceneSwitcher) {
        super('game-over');
        this.switcher = switcher;
    }

    setResult(isWin: boolean) {
        if (isWin) {
            this.add.image(1024 / 2, 768 / 2, 'youwin');
        }
        else {
            this.add.image(1024 / 2, 768 / 2, 'youlose');
        }
        return this;
    }

    create() {
        this.scene.sleep();
        this.switcher.reportStandby(this);
    }
}

export {GameoverScene as default};