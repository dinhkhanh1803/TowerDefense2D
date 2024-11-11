import { Assets, BitmapText, Container, Sprite, TextStyle, Texture } from "pixi.js";
import { GameTypes } from "../types/GameTypes";
import AssetLoad from "../utils/AssetLoad";
import { Game } from "../game";
import { sound } from "@pixi/sound";

export class LoadingScene extends Container {
    private background: Sprite;
    private loadingBar: Sprite;
    private loadingBarBackground: Sprite;
    public progress: number;
    private startButton: Sprite;

    constructor() {
        super();

        this.background = new Sprite(Texture.from('bg_load'));
        this.background.anchor.set(0.5);
        this.background.width = GameTypes.GAME_WIDTH;
        this.background.height = GameTypes.GAME_HEIGHT;
        this.background.x = GameTypes.GAME_WIDTH / 2;
        this.background.y = GameTypes.GAME_HEIGHT / 2;
        this.addChild(this.background);

        this.progress = 0;

        // Tạo nền cho thanh tải
        this.loadingBarBackground = new Sprite(Texture.from("loading_bar_bg"));
        this.loadingBarBackground.anchor.set(0.5);
        this.loadingBarBackground.width = 400;
        this.loadingBarBackground.height = 20;
        this.loadingBarBackground.x = GameTypes.GAME_WIDTH / 2;
        this.loadingBarBackground.y = GameTypes.GAME_HEIGHT / 2 + 120;
        this.addChild(this.loadingBarBackground);

        this.loadingBar = new Sprite(Texture.from("loading_bar_fill"));
        this.loadingBar.anchor.set(0, 0.5);
        this.loadingBar.width = 0;
        this.loadingBar.height = 20;
        this.loadingBar.x = this.loadingBarBackground.x - this.loadingBarBackground.width / 2;
        this.loadingBar.y = GameTypes.GAME_HEIGHT / 2 + 120;
        this.addChild(this.loadingBar);


        this.startButton = new Sprite(AssetLoad.getTexture('btn_start'))
        this.startButton.anchor.set(0.5);
        this.startButton.x = GameTypes.GAME_WIDTH / 2;
        this.startButton.y = GameTypes.GAME_HEIGHT / 2 + 250;
        this.startButton.visible = false;
        this.startButton.interactive = true;
        this.startButton.eventMode = 'static';
        this.startButton.on('pointerdown', () => this.onStartButtonClick());

        this.addChild(this.startButton);
    }

    public update(deltaTime: number) {
        const targetWidth = this.loadingBarBackground.width * this.progress;

        this.loadingBar.width += (targetWidth - this.loadingBar.width) * 0.1 * deltaTime;

        if (this.progress >= 1 && !this.startButton.visible) {
            this.startButton.visible = true;
        }
    }

    private onStartButtonClick() {
        Game.instance.loadMapLevel();
    }
}