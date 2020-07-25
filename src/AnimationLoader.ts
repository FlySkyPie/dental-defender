import BattlezoneScene from './BattlezoneScene';

class AnimationLoader {
    constructor() {
    }

    load(scene: BattlezoneScene) {
        const anims = scene.anims;
        anims.create({
            key: "right",
            frames: anims.generateFrameNames("player", {start: 0, end: 3}),
            frameRate: 7,
            repeat: 1
        });
        anims.create({
            key: "right-idle",
            frames: anims.generateFrameNames("player", {start: 0, end: 0}),
            frameRate: 7,
            repeat: 1
        });
        anims.create({
            key: "left",
            frames: anims.generateFrameNames("player", {start: 7, end: 4}),
            frameRate: 7,
            repeat: 1
        });
        anims.create({
            key: "left-idle",
            frames: anims.generateFrameNames("player", {start: 4, end: 4}),
            frameRate: 7,
            repeat: 1
        });
    }


}

export {AnimationLoader as default};
