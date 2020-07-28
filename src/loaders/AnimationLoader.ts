import 'phaser'
import Scene = Phaser.Scene;

class AnimationLoader {
    constructor() {
    }

    load(scene: Scene) {
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

        anims.create({
            key: "right-damaged",
            frames: anims.generateFrameNames("player", {start: 8, end: 11}),
            frameRate: 7,
            repeat: 1
        });
        anims.create({
            key: "right-idle-damaged",
            frames: anims.generateFrameNames("player", {start: 8, end: 8}),
            frameRate: 7,
            repeat: 1
        });
        anims.create({
            key: "left-damaged",
            frames: anims.generateFrameNames("player", {start: 15, end: 12}),
            frameRate: 7,
            repeat: 1
        });
        anims.create({
            key: "left-idle-damaged",
            frames: anims.generateFrameNames("player", {start: 12, end: 12}),
            frameRate: 7,
            repeat: 1
        });

        anims.create({
            key: "corn-right",
            frames: anims.generateFrameNames("corn", {start: 4, end: 7}),
            frameRate: 7,
            repeat: 1
        });

        anims.create({
            key: "corn-left",
            frames: anims.generateFrameNames("corn", {start: 0, end: 3}),
            frameRate: 7,
            repeat: 1
        });

        anims.create({
            key: "mint-right",
            frames: anims.generateFrameNames("mint", {start: 4, end: 7}),
            frameRate: 7,
            repeat: 1
        });

        anims.create({
            key: "mint-left",
            frames: anims.generateFrameNames("mint", {start: 0, end: 3}),
            frameRate: 7,
            repeat: 1
        });

        anims.create({
            key: "gumball-right",
            frames: anims.generateFrameNames("gumball", {start: 4, end: 7}),
            frameRate: 7,
            repeat: 1
        });

        anims.create({
            key: "gumball-left",
            frames: anims.generateFrameNames("gumball", {start: 0, end: 3}),
            frameRate: 7,
            repeat: 1
        });
    }
}

export {AnimationLoader as default};