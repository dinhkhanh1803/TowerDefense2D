import { Application } from 'pixi.js';
import { GameBoard } from './scenes/GameBoard';
import { EventHandle } from './utils/EventHandle';
import { MapScene } from './scenes/MapScene';
import { levels } from './data/levels';
import { LoadingScene } from './scenes/LoadingScrene';


export class Game {
    public static instance: Game;
    private app: Application;
    private allLevels: number;
    public currentLevel: number;
    private levelUnlockStatus: boolean[];


    constructor(app: Application) {
        Game.instance = this;
        this.app = app;
        this.allLevels = levels.length;
        this.currentLevel = 1;
        this.levelUnlockStatus = Array(this.allLevels).fill(false); // Mặc định tất cả đều khóa
        this.levelUnlockStatus[0] = true; // Mở khóa cấp độ 1
    }

    // Bắt đầu game
    start(): void {
        this.loadGameScene(1);
    }

    loadAssets() {
        const loadingScene = new LoadingScene();
        let simulatedProgress = 0;
        this.app.ticker.add((time) => {
            // Cập nhật giá trị progress để thử nghiệm
            simulatedProgress += 0.01 * time.deltaTime; // Điều chỉnh tốc độ tăng
            loadingScene.progress = Math.min(simulatedProgress, 1); // Đảm bảo progress không vượt quá 1

            // Cập nhật loadingScene với deltaTime
            loadingScene.update(time.deltaTime);
        });
        this.app.stage.addChild(loadingScene);
    }

    loadMapLevel(): void {
        const maplevel = new MapScene(this.currentLevel);
        this.app.stage.addChild(maplevel);
    }

    // Chuyển đổi sang scene GameScene
    public loadGameScene(levelId: number): void {
        this.app.stage.removeChildren(0);
        const currentScene = new GameBoard(levelId, 1);
        this.app.ticker.add(time => {
            currentScene.update(time.deltaTime);
        });
        this.app.stage.addChild(currentScene);
    }

    public reloadGameScene(levelId: number): void {
        this.loadGameScene(levelId);
    }

    // Hàm để mở khóa cấp độ tiếp theo
    public unlockNextLevel(currentLevel: number) {
        if (this.currentLevel < this.allLevels && currentLevel === this.currentLevel) {
            this.levelUnlockStatus[this.currentLevel] = true; // Mở khóa cấp độ tiếp theo
            this.currentLevel++;
        }
    }
}
