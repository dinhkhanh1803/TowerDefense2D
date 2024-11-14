import { TowerController } from '../controllers/TowerController';
import { EnemyController } from '../controllers/EnemyController';
import { AnimatedSprite, Application, Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { LevelManager } from "../managers/LevelManager";
import { EventHandle } from '../utils/EventHandle';
import { ObjectPool } from '../utils/ObjectPool';
import { ProjectileController } from '../controllers/ProjectileController';
import { LevelTypes } from '../types/LevelTypes';
import { PlayerController } from '../controllers/PlayerController';
import { HUD } from './displays/HUD';
import { TowerInfoPannel } from './systempannels/TowerInfoPannel';
import { TowerSelectionPannel } from './systempannels/TowerSelectionPannel';
import { HeroController } from '../controllers/HeroController';
import { SkillSystemPannel } from './systempannels/SkillSystemPannel';
import { GameTypes } from '../types/GameTypes';
import { SoundManager } from '../managers/SoundManager';
import { MapBuilder } from './displays/MapBuilder';
import { ResultPannel } from './displays/ResultPannel';

export class GameBoard extends Container {
    public static instance: GameBoard;
    private levelManager: LevelManager;
    private objectPool: ObjectPool;
    private mapContainer: Container;
    private towerSelectionPannel: TowerSelectionPannel;
    private towerInfoPannel: TowerInfoPannel;
    private skillSystemPannel: SkillSystemPannel;
    private towerController: TowerController;
    private projectileController: ProjectileController;
    private enemyController: EnemyController;
    private playerController: PlayerController;
    private heroController!: HeroController;
    private mapBuilder: MapBuilder;
    private headsUpDisplay: HUD;


    private levelId: number;
    private heroId?: number;
    private levelData: LevelTypes;
    public isGameOver: boolean = false;

    constructor(levelId: number, heroId?: number) {
        super();
        GameBoard.instance = this;

        this.levelId = levelId;

        this.mapContainer = new Container();
        this.addChild(this.mapContainer);
        this._listenEventHandle();

        this.objectPool = new ObjectPool();
        this.levelManager = new LevelManager(this.levelId);
        this.levelData = this.levelManager.getLevelData();

        this.towerController = new TowerController();
        this.projectileController = new ProjectileController();
        this.enemyController = new EnemyController(this.levelData.map.tiles);
        this.playerController = new PlayerController(this.levelData.levelNumber);

        if (heroId) {
            this.heroId = heroId;
            this.heroController = new HeroController(heroId, this.mapContainer, this.levelData);
        }

        this.mapBuilder = new MapBuilder(this.levelData);

        this.skillSystemPannel = new SkillSystemPannel(heroId);
        this.addChild(this.skillSystemPannel);
        this.towerSelectionPannel = new TowerSelectionPannel(this.levelData.towersAvailable);
        this.addChild(this.towerSelectionPannel);
        this.towerInfoPannel = new TowerInfoPannel();
        this.addChild(this.towerInfoPannel)
        this.headsUpDisplay = new HUD();
        this.addChild(this.headsUpDisplay);

        if (!SoundManager.instance.isMuted) {
            EventHandle.emit(GameTypes.event.playSound, 'game_sound', {
                sprite: 'battlemusic',
                loop: true,
                volume: 0.8
            });
        }
    }

    private _listenEventHandle() {
        if (!this.isGameOver) {
            EventHandle.on(GameTypes.event.addChildToMap, (sprite: Sprite | AnimatedSprite | Graphics | Container) => {
                this.mapContainer.addChild(sprite);
            });
            EventHandle.on(GameTypes.event.removeChildFromMap, (sprite: Sprite | AnimatedSprite | Graphics | Container) => {
                this.mapContainer.removeChild(sprite);
            });
            EventHandle.on(GameTypes.event.gameResult, this.showResult.bind(this));
        }
    }


    private showResult(isWin: boolean, healthPercentage: number): void {
        const resultPanel = new ResultPannel(isWin, healthPercentage, this.levelId);
        this.addChild(resultPanel);
        this.isGameOver = true;
    }


    update(deltaTime: number) {
        if (!this.isGameOver) {
            this.enemyController.update(deltaTime);
            this.towerController.update(deltaTime);
            this.projectileController.update(deltaTime);
            if (this.heroId) {
                this.heroController.update(deltaTime);
            }
        }
    }
}