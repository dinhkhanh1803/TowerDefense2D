import { Application, BitmapText, Container, Sprite, TextStyle, Texture } from "pixi.js";
import { GameBoard } from "./GameBoard";
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
    private soundBtn: Sprite;
    private finger: Sprite;
    private fingerOffset: number;

    constructor(currentLevel: number) {
        super();
        MapScene.instance = this;

        this.currentLevel = currentLevel;

        this.background = this.loadMapLevel();
        this.addChild(this.background);

        this.soundBtn = SoundManager.instance.getSoundButton();
        this.addChild(this.soundBtn);

        this.loadLevel();

        this.finger = new Sprite(AssetLoad.getTexture('finger'));
        this.finger.anchor.set(0.5);
        this.finger.position.set((this.currentLevel - 1) * 170 + 170, 350);
        this.addChild(this.finger);

        this.fingerOffset = 0;
        this.animateFinger();

        if (!SoundManager.instance.isMuted) {
            EventHandle.emit('play-sound', 'game_sound', {
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
            // Kiểm tra nếu cấp độ đã mở thì dùng icon mở khoá, ngược lại dùng icon khóa
            const texture = i <= this.currentLevel ? 'flag_level' : 'flag_level_lock';
            const levelSprite = new Sprite(AssetLoad.getTexture(texture));
            levelSprite.position.x = (i - 1) * 170 + startX;
            levelSprite.position.y = startY;
            this.addChild(levelSprite);


            // Nếu cấp độ đã mở, thêm sự kiện chọn cấp độ
            if (i <= this.currentLevel) {
                // Hiển thị số cấp độ
                const style = new TextStyle({
                    fontSize: 24,
                    fill: '#ffffff',
                    fontWeight: 'bold',
                    align: 'center',
                });
                const levelText = new BitmapText(i.toString(), style);
                levelText.anchor.set(0.5);
                levelText.position.set(levelSprite.width / 2, levelSprite.height / 2 - 10); // Điều chỉnh vị trí của số

                levelSprite.addChild(levelText);
                levelSprite.interactive = true;
                levelSprite.cursor = 'pointer';
                levelSprite.on('pointerdown', () => this.selectMap(i));
            }
        }
    }

    public selectMap(levelId: number) {
        Game.instance.loadGameScene(levelId)
    }

    private animateFinger() {
        // Hàm này sẽ di chuyển ngón tay lên xuống
        const up = () => {
            this.fingerOffset = Math.sin(Date.now() / 500) * 10; // Điều chỉnh độ cao
            this.finger.position.y = 350 + this.fingerOffset; // Cập nhật vị trí ngón tay
            requestAnimationFrame(up); // Gọi lại hàm để tiếp tục animation
        };

        up(); // Bắt đầu animation
    }

}
