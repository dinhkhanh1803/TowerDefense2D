import { Container, Graphics, Sprite } from "pixi.js";
import AssetLoad from "../../utils/AssetLoad";
import { GameTypes } from "../../types/GameTypes";
import { Game } from "../../game";
import { EventHandle } from "../../utils/EventHandle";

export class PauseGame extends Container {
    public static instance: PauseGame;
    private pauseBtn: Sprite;
    private pausePanel!: Container;
    private levelId: number;
    private isPaused: boolean = false;

    constructor(level: number) {
        super();
        PauseGame.instance = this;
        this.levelId = level;

        this.pauseBtn = new Sprite(AssetLoad.getTexture('pause_btn'));
        this.init();
        this.addChild(this.pauseBtn);
    }

    private init() {
        this.pauseBtn.x = 980;
        this.pauseBtn.y = 40;
        this.pauseBtn.scale.set(0.8);
        this.pauseBtn.anchor.set(0.5);
        this.pauseBtn.interactive = true;
        this.pauseBtn.cursor = 'pointer';
        this.eventMode = 'static';
        this.pauseBtn.on('pointerdown', () => {
            this.isPaused = true;
            this.pausePanel = this.GamePausePanel();
            this.addChild(this.pausePanel);
            EventHandle.emit(GameTypes.event.togglePause, this.isPaused);
        });

    }

    private GamePausePanel(): Container {
        const pausePanel = new Container();

        const background = new Graphics();
        background.rect(0, 0, GameTypes.MAP_WIDTH, GameTypes.MAP_HEIGHT);
        background.fill(0x000000);
        background.alpha = 0.5;
        background.interactive = true;
        background.cursor = 'default';
        background.on('pointerdown', (e) => {
            e.stopPropagation();
        });

        const bgSprite = new Sprite(AssetLoad.getTexture('pause_ui'));
        bgSprite.x = GameTypes.MAP_WIDTH / 2;
        bgSprite.y = GameTypes.MAP_HEIGHT / 2;
        bgSprite.anchor.set(0.5);

        const continueBtn = this.createButton(200, 80, 260, 400, 'continue-btn');
        continueBtn.on('pointerdown', this.onContinue);

        const restartBtn = this.createButton(200, 80, 510, 400, 'restart-btn');
        restartBtn.on('pointerdown', this.onRetry);

        const maplevelBtn = this.createButton(200, 80, 760, 400, 'maplevel-btn');
        maplevelBtn.on('pointerdown', this.onExit);

        pausePanel.addChild(background);
        pausePanel.addChild(bgSprite);
        pausePanel.addChild(continueBtn);
        pausePanel.addChild(restartBtn);
        pausePanel.addChild(maplevelBtn);

        return pausePanel;
    }

    private onContinue = () => {
        this.isPaused = false;
        this.removeChild(this.pausePanel);
        EventHandle.emit(GameTypes.event.togglePause, this.isPaused);
    };

    private onRetry = () => {
        Game.instance.reloadGameScene(this.levelId);
    };

    private onExit = () => {
        Game.instance.loadMapLevel();
    };

    private createButton(w: number, h: number, x: number, y: number, texture: string): Sprite {
        const button = new Sprite(AssetLoad.getTexture(texture));
        button.x = x;
        button.y = y;
        button.width = w;
        button.height = h;
        button.anchor.set(0.5);
        button.interactive = true;
        button.eventMode = 'static';
        button.cursor = 'pointer';
        return button;
    }
}
