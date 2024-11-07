import { Application, BitmapText, Container, Sprite, TextStyle, Texture } from "pixi.js";
import { GameBoard } from "./GameBoard";
import { GameTypes } from "../types/GameTypes";
import AssetLoad from "../utils/AssetLoad";
import { levels } from "../data/levels";
import { Game } from "../game";

export class MapScene extends Container {
    public static instance: MapScene;
    private background: Sprite;
    public currentLevel: number;
    private finger: Sprite;
    private fingerOffset: number;

    constructor(currentLevel: number) {
        super();
        MapScene.instance = this;

        this.currentLevel = currentLevel;

        this.background = new Sprite(Texture.from('maplevel_bg'));
        this.background.anchor.set(0.5);
        this.background.width = GameTypes.GAME_WIDTH;
        this.background.height = GameTypes.GAME_HEIGHT;
        this.background.x = GameTypes.GAME_WIDTH / 2;
        this.background.y = GameTypes.GAME_HEIGHT / 2;
        this.addChild(this.background);

        this.loadLevel();

        // Khởi tạo ngón tay
        this.finger = new Sprite(AssetLoad.getTexture('finger')); // Thay 'finger' bằng tên texture của ngón tay
        this.finger.anchor.set(0.5);
        this.finger.position.set((this.currentLevel - 1) * 170 + 170, 350); // Điều chỉnh vị trí ngón tay
        this.addChild(this.finger);

        this.fingerOffset = 0; // Bắt đầu không có offset
        this.animateFinger();
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

    // Giả sử có hàm này để chọn map
    selectMap(levelId: number) {
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
