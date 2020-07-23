import 'phaser';
import BattlezoneScene from './BattlezoneScene';

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
        this.game.scene.add("battlezone", battlezoneScene);
        this.game.scene.start('battlezone');
    }
}

export {SimpleGame as default};