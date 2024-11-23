import { BitmapText, Container, Sprite, TextStyle, Texture } from "pixi.js";
import { GameTypes } from "../types/GameTypes";
import AssetLoad from "../utils/AssetLoad";
import { levels } from "../data/levels";
import { Game } from "../game";
import { EventHandle } from "../utils/EventHandle";
import { GameSave } from "../utils/GameSave";
import { SoundManager } from "../managers/SoundManager";

export class MapScene extends Container {
    public static instance: MapScene;
    private background: Sprite;
    public currentLevel: number;
    private towerpediaBtn: Sprite;
    private soundBtn: Sprite;
    private starBar: Sprite;
    private finger: Sprite;
    private fingerOffset: number;

    constructor(currentLevel: number) {
        super();
        MapScene.instance = this;

        this.currentLevel = currentLevel;

        this.background = this.loadMapLevel();
        this.addChild(this.background);

        this.loadLevel();

        this.soundBtn = SoundManager.instance.getSoundButton();
        this.addChild(this.soundBtn);

        this.towerpediaBtn = this.towerpediaBtnSprite();
        this.addChild(this.towerpediaBtn);

        this.starBar = this.starBarSprite();
        this.addChild(this.starBar);

        this.finger = this.fingerSprite();
        this.addChild(this.finger);

        this.fingerOffset = 0;
        this.animateFinger();

        if (!SoundManager.instance.isMuted) {
            EventHandle.emit(GameTypes.event.playSound, 'game_sound', {
                sprite: 'gametitle',
                loop: true,
                volume: 0.8
            });
        }
    }

    private loadMapLevel(): Sprite {
        const background = new Sprite(Texture.from('maplevel_bg'));
        background.anchor.set(0.5);
        background.width = GameTypes.GAME_WIDTH;
        background.height = GameTypes.GAME_HEIGHT;
        background.x = GameTypes.GAME_WIDTH / 2;
        background.y = GameTypes.GAME_HEIGHT / 2;
        return background;
    }

    private loadLevel() {
        const mapLength = levels.length;;
        const startX = 150;
        const startY = 400;

        for (let i = 1; i <= mapLength; i++) {
            const texture = i <= this.currentLevel ? 'flag_level' : 'flag_level_lock';
            const levelSprite = new Sprite(AssetLoad.getTexture(texture));
            levelSprite.position.x = (i - 1) * 170 + startX;
            levelSprite.position.y = startY;
            this.addChild(levelSprite);

            // Lấy số sao cao nhất của cấp độ hiện tại
            const stars = GameSave.loadStars(i);

            // Hiển thị số sao cho mỗi cấp độ
            if (stars > 0) {
                const starTexture = `level_star_${stars}`; // Chọn texture dựa vào số sao
                const starSprite = new Sprite(AssetLoad.getTexture(starTexture));
                starSprite.anchor.set(0.5);
                starSprite.scale.set(0.5);
                starSprite.position.set(levelSprite.width / 2, levelSprite.height - 90); // Đặt vị trí dưới level icon
                levelSprite.addChild(starSprite);
            }
            // Nếu cấp độ đã mở, thêm sự kiện chọn cấp độ
            if (i <= this.currentLevel) {
                // Hiển thị số cấp độ
                const style = new TextStyle({
                    fontSize: 24,
                    fill: '#ffffff',
                    fontWeight: 'bold',
                    align: 'center',
                });
                const levelText = new BitmapText({ text: i.toString(), style });
                levelText.anchor.set(0.5);
                levelText.position.set(levelSprite.width / 2, levelSprite.height / 2 - 10); // Điều chỉnh vị trí của số

                levelSprite.addChild(levelText);
                levelSprite.interactive = true;
                levelSprite.cursor = 'pointer';
                levelSprite.on('pointerdown', () => this.selectLevel(i));
            }
        }
    }

    private starBarSprite(): Sprite {
        const posX = 100;
        const posY = 50;
        const getStar = GameSave.getTotalStars();

        const starBar = new Sprite(AssetLoad.getTexture('star_bar'));
        starBar.position.set(posX, posY);
        starBar.anchor.set(0.5, 0.3);

        const numberStar = new BitmapText({
            text: getStar.toString(), style: {
                fontSize: 24,
                fill: '#ffffff',
                fontWeight: 'bold',
                align: 'center',
            }
        });

        starBar.addChild(numberStar);

        return starBar;
    }

    private towerpediaBtnSprite(): Sprite {
        const btn = new Sprite(AssetLoad.getTexture('btn_towerpedia'));
        btn.position.set(100, 700);
        btn.anchor.set(0.5, 0.5);
        btn.interactive = true;
        btn.cursor = 'pointer';
        btn.on('pointerdown', () => {
            this.openTowerpedia();
        });
        return btn;
    }

    private openTowerpedia() {
        Game.instance.loadTowerpedia();
    }

    private selectLevel(levelId: number) {
        Game.instance.loadGameScene(levelId)
    }

    private fingerSprite(): Sprite {
        const finger = new Sprite(AssetLoad.getTexture('finger'));
        finger.anchor.set(0.5);
        finger.position.set((this.currentLevel - 1) * 170 + 170, 350);
        return finger;
    }

    private animateFinger() {

        const up = () => {
            this.fingerOffset = Math.sin(Date.now() / 500) * 10; // Điều chỉnh độ cao
            this.finger.position.y = 350 + this.fingerOffset; // Cập nhật vị trí ngón tay
            requestAnimationFrame(up); // Gọi lại hàm để tiếp tục animation
        };

        up(); // Bắt đầu animation
    }
}
