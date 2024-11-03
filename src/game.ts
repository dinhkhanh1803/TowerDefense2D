import { Application } from 'pixi.js';
import { GameBoard } from './scenes/GameBoard';
import { EventHandle } from './utils/EventHandle';
import { MapScene } from './scenes/MapScene';


export class Game {
    public static instance: Game;
    private app: Application;
    currentLevel: number;

    constructor(app: Application) {
        Game.instance = this;
        this.currentLevel = 1;
        this.app = app;
    }

    // Bắt đầu game
    start(): void {
        this.loadMapLevel();
    }

    loadMapLevel(): void {
        const maplevel = new MapScene(this.currentLevel);
        this.app.stage.addChild(maplevel);
    }

    // Chuyển đổi sang scene GameScene
    loadGameScene(levelId: number): void {
        this.app.stage.removeChildren(0);
        const currentScene = new GameBoard(levelId);
        this.app.ticker.add(time => {
            currentScene.update(time.deltaTime);
        });
        this.app.stage.addChild(currentScene);
    }

    reloadGameScene(levelId: number): void {
        this.loadGameScene(levelId);
    }
}
