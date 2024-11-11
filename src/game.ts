import { Application } from 'pixi.js';
import { GameBoard } from './scenes/GameBoard';
import { EventHandle } from './utils/EventHandle';
import { MapScene } from './scenes/MapScene';
import { levels } from './data/levels';
import { LoadingScene } from './scenes/LoadingScrene';
import { SoundManager } from './managers/SoundManager';
import { GameSave } from './utils/GameSave';


export class Game {
    public static instance: Game;
    private app: Application;
    private soundManager: SoundManager;
    private allLevels: number;
    public currentLevel: number;
    private isMute: boolean;
    private levelUnlockStatus: boolean[];


    constructor(app: Application) {
        Game.instance = this;
        this.app = app;
        this.soundManager = new SoundManager();

        this.allLevels = levels.length;
        this.currentLevel = GameSave.loadCurrentLevel();
        this.isMute = GameSave.loadSoundSetting();
        this.levelUnlockStatus = Array(this.allLevels).fill(false);
        this.levelUnlockStatus[0] = true;
    }

    // Bắt đầu game
    start(): void {
        this.loadAssets();
    }

    private loadAssets() {
        const loadingScene = new LoadingScene();
        let simulatedProgress = 0;
        this.app.ticker.add((time) => {
            simulatedProgress += 0.01 * time.deltaTime; // Điều chỉnh tốc độ tăng
            loadingScene.progress = Math.min(simulatedProgress, 1); // Đảm bảo progress không vượt quá 1

            // Cập nhật loadingScene với deltaTime
            loadingScene.update(time.deltaTime);
        });
        this.app.stage.addChild(loadingScene);
    }

    public loadMapLevel(): void {
        EventHandle.emit('scene-changed', 'map-scene');
        const maplevel = new MapScene(this.currentLevel);
        this.app.stage.addChild(maplevel);
    }

    // Chuyển đổi sang scene GameScene
    public loadGameScene(levelId: number): void {
        EventHandle.emit('scene-changed', 'game-scene');

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
            this.levelUnlockStatus[this.currentLevel] = true;
            this.currentLevel++;
            GameSave.saveCurrentLevel(this.currentLevel);
        }
    }
}
