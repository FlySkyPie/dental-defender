import 'phaser';
import Scene = Phaser.Scene;

interface SceneSwitcher {
    startGame(): void;
    reportStandby(scene: Scene): void;
    startBattle(): void;
    goShop(): void;
    backToBattle(): void;
    gameover(isWin: boolean): void;
}

export default SceneSwitcher;