import 'phaser';
import Scene = Phaser.Scene;

interface SceneSwitcher {
    startGame(): void;
    startBattle(): void;
    goShop(): void;
    backToBattle(): void;
    gameover(isWin: boolean): void;
}

export default SceneSwitcher;