import BattlezoneScene from './BattlezoneScene';
import Corn from './entities/Corn';
import Mint from './entities/Mint';

class CollisionLoader {

    constructor() {
    }

    load(scene: BattlezoneScene) {
        scene.physics.add.collider(scene.player, scene.wallsLayer);
        scene.physics.add.collider(scene.player, scene.tooth);
        scene.physics.add.collider(scene.monstersGroup, scene.player,
            (monster: any, player: any) => {
                if (monster instanceof Corn) {
                    player.damage(20);
                    monster.destroy();
                } else if (monster instanceof Mint) {
                    player.damage(10);
                    monster.destroy();
                }
            });

        scene.physics.add.collider(scene.bulletsGroup, scene.wallsLayer,
            (bullet: any) => {bullet.destroy()});
        scene.physics.add.collider(scene.bulletsGroup, scene.tooth,
            (bullet: any) => {
                bullet.destroy();
            });
        scene.physics.add.collider(scene.bulletsGroup, scene.monstersGroup,
            (bullet: any, monster: any) => {
                monster.damage(bullet.host.attackDamage, bullet.host);
                bullet.destroy();
            });

        scene.physics.add.collider(scene.monstersGroup, scene.tooth, (monster: any, tooth: any) => {
            if (monster instanceof Corn) {
                tooth.damage(30);
                monster.destroy();
            } else if (monster instanceof Mint) {
                tooth.damage(20);
                monster.destroy();
            }
        });
        scene.physics.add.collider(scene.monsterBulletGroup, scene.wallsLayer,
            (bullet: any) => {bullet.destroy()});
        scene.physics.add.collider(scene.monsterBulletGroup, scene.tooth,
            (bullet: any, tooth: any) => {
                tooth.damage(10);
                bullet.destroy();
            });
        scene.physics.add.collider(scene.monsterBulletGroup, scene.player,
            (bullet: any, player: any) => {
                player.damage(10);
                bullet.destroy();
            });
    }
}

export default CollisionLoader;