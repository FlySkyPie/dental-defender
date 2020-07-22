import 'phaser';
class BattlezoneScene extends Phaser.Scene {
    controls: Phaser.Cameras.Controls.FixedKeyControl | undefined;

    constructor() {
        super('app');
    }

    preload() {
        this.load.image('tileset-image', 'assets/images/tileset.png');
        this.load.tilemapTiledJSON("test3", 'assets/tilemaps/test3.json');

        //test
        this.load.image("tiles", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/tuxmon-sample-32px-extruded.png");
        this.load.tilemapTiledJSON("map", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/tuxemon-town.json");
    }

    create() {
        //test
        //sconst map = this.make.tilemap({key: "map"});
        //const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
        //const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
        //const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        //const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
        
        const map = this.make.tilemap({key: "test3"});
        const tileset = map.addTilesetImage("tileset", "tileset-image");
        const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
        const wallsLayer = map.createStaticLayer("walls", tileset, 0, 0);

        // Parameters: layer name (or index) from Tiled, tileset, x, y


        // Phaser supports multiple cameras, but you can access the default camera like  this:
        const camera = this.cameras.main;

        // Set up the arrows to control the camera
        const cursors = this.input.keyboard.createCursorKeys();

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        });

        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, "Arrow keys to scroll", {
                font: "18px monospace",
                fill: "#ffffff",
                padding: {x: 20, y: 10},
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);
    }

    update(time: any, delta: any) {
        super.update(time, delta);
        if (this.controls !== undefined) {
            this.controls.update(delta);

        }
    }
}

export {BattlezoneScene as default};