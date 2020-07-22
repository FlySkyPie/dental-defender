import 'phaser';
import BattlezoneScene from './BattlezoneScene';

class SimpleGame {
    game: Phaser.Game;
    controls: Phaser.Cameras.Controls.FixedKeyControl | undefined;

    constructor() {
        let scene = new BattlezoneScene();

        const config = {
            type: Phaser.AUTO,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {y: 0} // Top down game, so no gravity
                }
            },
            width: 800,
            height: 600,
            parent: "app",
            pixelArt: true,
            scene: scene
        };

        this.game = new Phaser.Game(config);
    }



}

export {SimpleGame as default};