import 'phaser';
import SceneSwitcher from '../interfaces/SceneSwitcher';

class GameoverScene extends Phaser.Scene {
    private isWin: boolean;
    private switcher: SceneSwitcher;
    
    constructor(switcher: SceneSwitcher) {
        super('game-over');
        this.switcher = switcher;
        this.isWin = false;
    }

    setResult(value: boolean) {
        this.isWin = value;
    }

    preload() {
        
    }

    create() {
        if (this.isWin) {
            this.add.image(1024 / 2, 768 / 2, 'youwin');
        }
        else {
            this.add.image(1024 / 2, 768 / 2, 'youlose');
        }
        this.scene.sleep();
        this.switcher.reportStandby(this);
    }
}

export {GameoverScene as default};