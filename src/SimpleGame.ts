import 'phaser';
import BattlezoneScene from './BattlezoneScene';
import MainMenuScene from './MainMenuScene';
import GameoverScene from './GameoverScene';

class SimpleGame {
    game: Phaser.Game;
    controls: Phaser.Cameras.Controls.FixedKeyControl | undefined;

    constructor() {
        const config = {
            type: Phaser.AUTO,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {y: 0} // Top down game, so no gravity
                }
            },
            width: 1024,
            height: 768,
            parent: "app",
            pixelArt: true
        };

        this.game = new Phaser.Game(config);

        let battlezoneScene = new BattlezoneScene();
        let mainmenuScene = new MainMenuScene();
        let gameoverScene = new GameoverScene();
        this.game.scene.add("battlezone", battlezoneScene);
        this.game.scene.add("main-menu", mainmenuScene);
        this.game.scene.add("game-over", gameoverScene);
        this.game.scene.start('game-over');
    }
}

export {SimpleGame as default};