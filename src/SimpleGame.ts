import 'phaser';
import Scene = Phaser.Scene;

import BattlezoneScene from './BattlezoneScene';
import MainMenuScene from './MainMenuScene';
import GameoverScene from './GameoverScene';
import HUDScene from './HUDScene';
import ShopScene from './ShopScene';
import LoadScene from './LoadScene';

import SceneSwitcher from './interfaces/SceneSwitcher'
import GameState from './utils/GameState';
import GameMonitor from './GameMonitor';
import PlayerController from './PlayerController';
import MainRole from './interfaces/MainRole';

class SimpleGame implements SceneSwitcher {
    game: Phaser.Game;
    private state: GameState;
    private isStandby: Array<boolean>;

    battlezoneScene: BattlezoneScene;
    mainmenuScene: MainMenuScene;
    gameoverScene: GameoverScene;
    hudScene: HUDScene;
    shopScene: ShopScene;
    loadScene: LoadScene;

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

        this.isStandby = [false, false, false, false, false];

        this.game = new Phaser.Game(config);
        this.state = GameState.Load;

        this.battlezoneScene = new BattlezoneScene(this);
        this.mainmenuScene = new MainMenuScene(this);
        this.gameoverScene = new GameoverScene(this);
        this.hudScene = new HUDScene(this);
        this.shopScene = new ShopScene(this);
        this.loadScene = new LoadScene(this);



        this.addScenesToGame();

        this.game.scene.start('load-scene');
    }

    private addScenesToGame() {
        this.game.scene.add("load-scene", this.loadScene);
        this.game.scene.add("battlezone", this.battlezoneScene);
        this.game.scene.add("main-menu", this.mainmenuScene);
        this.game.scene.add("hud-scene", this.hudScene);
        this.game.scene.add("game-over", this.gameoverScene);
        this.game.scene.add("shop-scene", this.shopScene);
    }

    startGame(): void {
        if (this.state !== GameState.Load) {
            throw "Start game at wrong game state!";
        }
        this.state = GameState.Start;
        this.game.scene.start('battlezone');
        this.game.scene.start('main-menu');
        this.game.scene.start('hud-scene');
        this.game.scene.start('game-over');
        this.game.scene.start('shop-scene');
    }

    reportStandby(scene: Scene): void {
        if (this.state !== GameState.Start) {
            throw "report standby at wrong game state!";
        }
        if (scene instanceof MainMenuScene) {
            this.isStandby[0] = true;
        } else if (scene instanceof BattlezoneScene) {
            this.isStandby[1] = true;
        } else if (scene instanceof ShopScene) {
            this.isStandby[2] = true;
        } else if (scene instanceof HUDScene) {
            this.isStandby[3] = true;
        } else if (scene instanceof GameoverScene) {
            this.isStandby[4] = true;
        }
        
        if (this.isStandby.indexOf(false) !== -1 ){
            return;
        }

        console.log('created!');
        this.mainmenuScene.scene.wake();
        this.state = GameState.Menu;
    }

    startBattle(): void {
        if (this.state !== GameState.Menu) {
            throw "Start battle at wrong game state!";
        }
        this.state = GameState.Battle;

        let gameMonitor = new GameMonitor(this.hudScene, this.shopScene);
        let player = this.battlezoneScene.getRole();
        if (player !== undefined) {
            let controller = new PlayerController(this.battlezoneScene, player, gameMonitor);
        }
        this.game.scene.wake('battlezone');
        this.game.scene.wake('hud-scene');
        this.mainmenuScene.scene.sleep();

    }

    goShop(): void {
        if (this.state !== GameState.Battle) {
            throw "Go shop at wrong game state!";
        }
        this.state = GameState.Shop;

    }

    backToBattle(): void {
        if (this.state !== GameState.Shop) {
            throw "Back to battle at wrong game state!";
        }
        this.state = GameState.Battle;

    }

    gameover(isWin: boolean): void {
        if (this.state !== GameState.Battle) {
            throw "Gameover at wrong game state!";
        }
        this.state = GameState.Gameover;

    }
}

export {SimpleGame as default};