import { Container, Graphics, Sprite, Texture } from "pixi.js";
import AssetLoad from "../../utils/AssetLoad";
import { GameTypes } from "../../types/GameTypes";
import { EventHandle } from "../../utils/EventHandle";

export class TutorialGame extends Container {
    public static instance: TutorialGame;
    private abountBtn: Sprite;
    private tutorialPanel!: Container;
    private tutorialImageSprite!: Sprite;
    private leftArrow!: Sprite;
    private rightArrow!: Sprite;
    private currentIndex: number = 1;

    private isPaused: boolean = false;

    constructor() {
        super();
        TutorialGame.instance = this;

        this.abountBtn = new Sprite(AssetLoad.getTexture('btn_about'));
        this.init();
        this.addChild(this.abountBtn);
    }

    private init() {
        this.abountBtn.x = 920;
        this.abountBtn.y = 40;
        this.abountBtn.scale.set(0.65);
        this.abountBtn.anchor.set(0.5);
        this.abountBtn.interactive = true;
        this.abountBtn.cursor = 'pointer';
        this.eventMode = 'static';
        this.abountBtn.on('pointerup', () => {
            this.isPaused = true;
            this.tutorialPanel = this.GameTurorialPanel();
            this.addChild(this.tutorialPanel);
            EventHandle.emit(GameTypes.event.togglePause, this.isPaused);
        });

    }

    private GameTurorialPanel(): Container {
        const tutorialPanel = new Container();

        const background = new Graphics();
        background.rect(0, 0, GameTypes.MAP_WIDTH, GameTypes.MAP_HEIGHT);
        background.fill(0x000000);
        background.alpha = 0.5;
        background.interactive = true;
        background.cursor = 'default';
        background.on('pointerup', (e) => {
            e.stopPropagation();
        });

        const bgSprite = new Sprite(Texture.from('bg_tutorial'));
        bgSprite.x = GameTypes.MAP_WIDTH / 2;
        bgSprite.y = GameTypes.MAP_HEIGHT / 2;
        bgSprite.anchor.set(0.5);

        const continueBtn = this.createButton(50, 50, 850, 100, 'btn_close');
        continueBtn.on('pointerup', this.close);

        this.tutorialImageSprite = new Sprite(Texture.from(`tutorial_${this.currentIndex}`));
        this.tutorialImageSprite.x = GameTypes.MAP_WIDTH / 2;
        this.tutorialImageSprite.y = GameTypes.MAP_HEIGHT / 2;
        this.tutorialImageSprite.anchor.set(0.5);

        this.leftArrow = this.showPreviousTower();
        this.rightArrow = this.showNextTower();


        tutorialPanel.addChild(background);
        tutorialPanel.addChild(bgSprite);
        tutorialPanel.addChild(this.tutorialImageSprite);
        tutorialPanel.addChild(this.rightArrow);
        tutorialPanel.addChild(this.leftArrow);
        tutorialPanel.addChild(continueBtn);
        this.updateArrowStates();
        return tutorialPanel;
    }

    private showPreviousTower(): Sprite {
        const btn = new Sprite(AssetLoad.getTexture('btn_arrow-left-on'));
        btn.position.set(100, 320);
        btn.anchor.set(0.5);

        btn.interactive = true;
        btn.on('pointerdown', () => {
            if (this.currentIndex > 1) {
                this.currentIndex--;
                this.updateTutorialImage();
                this.updateArrowStates();
                EventHandle.emit(GameTypes.event.playSound, 'effect_sound', {
                    sprite: 'button',
                    loop: false,
                    volume: 0.8
                });
            }
        });
        return btn;
    }

    private showNextTower(): Sprite {
        const btn = new Sprite(AssetLoad.getTexture('btn_arrow-right-on'));
        btn.position.set(924, 320);
        btn.anchor.set(0.5);

        btn.interactive = true;
        btn.on('pointerdown', () => {
            if (this.currentIndex < 3) {
                this.currentIndex++;
                this.updateTutorialImage();
                this.updateArrowStates();
                EventHandle.emit(GameTypes.event.playSound, 'effect_sound', {
                    sprite: 'button',
                    loop: false,
                    volume: 0.8
                });
            }
        });
        return btn;
    }

    private updateTutorialImage() {
        // Cập nhật hình ảnh tutorial dựa trên currentIndex
        this.tutorialImageSprite.texture = Texture.from(`tutorial_${this.currentIndex}`);
    }

    private close = () => {
        this.isPaused = false;
        this.removeChild(this.tutorialPanel);
        EventHandle.emit(GameTypes.event.togglePause, this.isPaused);
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

    private updateArrowStates() {
        // Cập nhật trạng thái nút trái
        if (this.currentIndex > 1) {
            this.leftArrow.texture = AssetLoad.getTexture('btn_arrow-left-on');
        } else {
            this.leftArrow.texture = AssetLoad.getTexture('btn_arrow-left-off');
        }

        // Cập nhật trạng thái nút phải
        if (this.currentIndex < 3) {
            this.rightArrow.texture = AssetLoad.getTexture('btn_arrow-right-on');
        } else {
            this.rightArrow.texture = AssetLoad.getTexture('btn_arrow-right-off');
        }
    }
}
