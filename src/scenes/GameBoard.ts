import { TowerController } from '../controllers/TowerController';
import { EnemyController } from '../controllers/EnemyController';
import { AnimatedSprite, Application, Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { LevelManager } from "../managers/LevelManager";
import { EnemyTypes } from "../types/EnemyTypes";
import { EventHandle } from '../utils/EventHandle';
import { Tower } from '../models/Tower';
import { TowerType } from '../types/TowerType';
import AssetLoad from '../utils/AssetLoad';
import { ObjectPool } from '../utils/ObjectPool';
import { ProjectileController } from '../controllers/ProjectileController';
import { LevelTypes } from '../types/LevelTypes';
import { GameConfig } from '../config/GameConfig';
import { PlayerController } from '../controllers/PlayerController';
import { HUD } from './Displays/HUD';
import { TowerInfoPannel } from './TowerInfoPannel';
import { TowerSelectionPannel } from './TowerSelectionPannel';
import { MapBuilder } from './Displays/MapBuilder';
import { ResultPannel } from './Displays/ResultPannel';
import { HeroController } from '../controllers/HeroController';
import { SkillSystemPannel } from './SkillSystemPannel';
import { GameTypes } from '../types/GameTypes';


export class GameBoard extends Container {
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
    private levelData: LevelTypes;
    private isGameOver: boolean = false;

    constructor(levelId: number, heroId?: number) {
        super();

        this.levelId = levelId;

        this.mapContainer = new Container();
        this.addChild(this.mapContainer);

        this.objectPool = new ObjectPool();
        this.levelManager = new LevelManager(this.levelId);
        this.levelData = this.levelManager.getLevelData();

        this.towerController = new TowerController();
        this.projectileController = new ProjectileController();
        this.enemyController = new EnemyController(this.levelData.map.tiles);
        this.playerController = new PlayerController(this.levelData.id);


        if (heroId) {
            this.heroController = new HeroController(heroId, this.mapContainer, this.levelData);
        }

        this.mapBuilder = new MapBuilder(this.mapContainer, this.levelData);
        this.mapBuilder.buildMap();
        this.skillSystemPannel = new SkillSystemPannel();
        this.addChild(this.skillSystemPannel);
        this.towerSelectionPannel = new TowerSelectionPannel();
        this.addChild(this.towerSelectionPannel);
        this.towerInfoPannel = new TowerInfoPannel();
        this.addChild(this.towerInfoPannel)
        this.headsUpDisplay = new HUD();
        this.addChild(this.headsUpDisplay);


        this._useEventEffect();
    }

    private _useEventEffect() {
        EventHandle.on(GameTypes.event.addChildToMap, (sprite: Sprite | AnimatedSprite | Graphics | Container) => {
            this.mapContainer.addChild(sprite);
        });
        EventHandle.on(GameTypes.event.removeChildFromMap, (sprite: Sprite | AnimatedSprite | Graphics | Container) => {
            this.mapContainer.removeChild(sprite);
        });
        EventHandle.on('gameResult', this.showResult.bind(this));
    }

    private showResult(isWin: boolean): void {
        const resultPanel = new ResultPannel(isWin);
        this.addChild(resultPanel);
        this.isGameOver = true;
    }


    update(deltaTime: number) {
        if (!this.isGameOver) {
            this.enemyController.update(deltaTime);
            this.towerController.update(deltaTime);
            this.projectileController.update(deltaTime);
            this.heroController.update(deltaTime);
        }
    }

    private setTitleMap(): number[][] {
        return this.levelData.map.tiles;
    }
}