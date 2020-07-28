import 'phaser';
import Scene = Phaser.Scene;
import BattlezoneScene from './scenes/BattlezoneScene';
import MenuScene from './scenes/MenuScene';
import GameoverScene from './scenes/GameoverScene';
import HUDScene from './scenes/HUDScene';
import ShopScene from './scenes/ShopScene';
import LoadScene from './scenes/LoadScene';

import SceneSwitcher from './interfaces/SceneSwitcher'
import GameState from './utils/GameState';

class StateManager implements SceneSwitcher {
    private game: Phaser.Game;
    private state: GameState;
    private isStandby: Array<boolean>;

    private battlezoneScene: BattlezoneScene | undefined;
    private menuScene: MenuScene | undefined;
    private gameoverScene: GameoverScene | undefined;
    private hudScene: HUDScene | undefined;
    private shopScene: ShopScene | undefined;
    private loadScene: LoadScene | undefined;

    private satrBattleCallback: (() => any) | undefined;
    private goShopCallback: (() => {}) | undefined;
    private backToBattleCallback: (() => {}) | undefined;
    private gameoverCallback: (() => {}) | undefined;

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
    }

    public setBattlezoneScene(battlezoneScene: BattlezoneScene): this {
        this.battlezoneScene = battlezoneScene;
        return this;
    }
    public setMenuScene(menuScene: MenuScene): this {
        this.menuScene = menuScene;
        return this;
    }
    public setGameoverScene(gameoverScene: GameoverScene): this {
        this.gameoverScene = gameoverScene;
        return this;
    }
    public setHUDScene(hudScene: HUDScene): this {
        this.hudScene = hudScene;
        return this;
    }
    public setShopScene(shopScene: ShopScene): this {
        this.shopScene = shopScene;
        return this;
    }
    public setLoadScene(loadScene: LoadScene): this {
        this.loadScene = loadScene;
        return this;
    }

    public setSatrBattleCallback(callback: () => any) {
        this.satrBattleCallback = callback;
    }

    public startGame() {
        if (this.loadScene === undefined) {
            return;
        } else if (this.battlezoneScene === undefined) {
            return;
        } else if (this.menuScene === undefined) {
            return;
        } else if (this.hudScene === undefined) {
            return;
        } else if (this.gameoverScene === undefined) {
            return;
        } else if (this.shopScene === undefined) {
            return;
        }
        this.game.scene.add("load-scene", this.loadScene);
        this.game.scene.add("battlezone", this.battlezoneScene);
        this.game.scene.add("main-menu", this.menuScene);
        this.game.scene.add("hud-scene", this.hudScene);
        this.game.scene.add("game-over", this.gameoverScene);
        this.game.scene.add("shop-scene", this.shopScene);

        this.game.scene.start('load-scene');
    }

    public goMenu(): void {
        if (this.state !== GameState.Load) {
            throw "Start game at wrong game state!";
        }
        this.state = GameState.StartingScenes;
        this.game.scene.start('battlezone');
        this.game.scene.start('main-menu');
        this.game.scene.start('hud-scene');
        this.game.scene.start('game-over');
        this.game.scene.start('shop-scene');
    }

    public reportStandby(scene: Scene): void {
        if (this.state !== GameState.StartingScenes) {
            throw "report standby at wrong game state!";
        }
        if (scene instanceof MenuScene) {
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

        if (this.isStandby.indexOf(false) !== -1) {
            return;
        }

        (this.menuScene as MenuScene).scene.wake();
        this.state = GameState.Menu;
    }

    public startBattle(): void {
        if (this.state !== GameState.Menu) {
            throw "Start battle at wrong game state!";
        }
        this.state = GameState.Battle;

        if (this.satrBattleCallback !== undefined) {
            this.satrBattleCallback();
        }

        this.game.scene.wake('battlezone');
        this.game.scene.wake('hud-scene');
        this.game.scene.sleep('main-menu');
    }

    public goShop(): void {
        if (this.state !== GameState.Battle) {
            throw "Go shop at wrong game state!";
        }
        this.state = GameState.Shop;

        this.game.scene.sleep('battlezone');
        this.game.scene.sleep('hud-scene');
        this.game.scene.wake('shop-scene');
    }

    public backToBattle(): void {
        if (this.state !== GameState.Shop) {
            throw "Back to battle at wrong game state!";
        }
        this.state = GameState.Battle;

        this.game.scene.sleep('shop-scene');
        this.game.scene.wake('battlezone');
        this.game.scene.wake('hud-scene');
    }

    public gameover(isWin: boolean): void {
        if (this.state !== GameState.Battle) {
            throw "Gameover at wrong game state!";
        }
        this.state = GameState.Gameover;

        this.game.scene.sleep('battlezone');
        this.game.scene.sleep('hud-scene');
        this.game.scene.wake('gameover');
    }
}

export default StateManager;