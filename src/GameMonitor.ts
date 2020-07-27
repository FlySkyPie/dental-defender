import HUDScene from './HUDScene';
import ShopScene from './ShopScene';
import BalanceMonitor from './interfaces/BalanceMonitor'
import CharacterMonitor from './interfaces/CharacterMonitor';

class GameMonitor implements BalanceMonitor, CharacterMonitor {
    hudScene: HUDScene;
    shopScene: ShopScene;

    constructor(hudScene: HUDScene, shopScene: ShopScene) {
        this.hudScene = hudScene;
        this.shopScene = shopScene;
    }

    updateHealth(health: number, healthMax: number): void {
        this.hudScene.updateHealth(health, healthMax);
    }
    updateSelectedItem(index: number): void {
        this.hudScene.updateSelectedItem(index);
    }
    updateMoney(value: number): void {
        this.hudScene.updateMoney(value);
        this.shopScene.updateMoney(value);
    }

    updateStock(amounts: [number, number, number]): void {
        this.hudScene.updateStock(amounts);
        this.shopScene.updateStock(amounts);
    }
}

export default GameMonitor;