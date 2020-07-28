import 'phaser';
import Scene = Phaser.Scene;

interface SceneSwitcher {
    goMenu(): void;
    reportStandby(scene: Scene): void;
    startBattle(): void;
    goShop(): void;
    backToBattle(): void;
    gameover(isWin: boolean): void;
}

export default SceneSwitcher;