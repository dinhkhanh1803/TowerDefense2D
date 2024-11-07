import { EnemyController } from './EnemyController';
import { Container, PointData } from "pixi.js";
import { herosData } from "../data/heros";
import { Hero } from "../models/Hero";
import { LevelTypes } from "../types/LevelTypes";
import { bfsPathfinding } from "../utils/BfsPathfinding";
import { Tween } from "@tweenjs/tween.js";
import { EventHandle } from "../utils/EventHandle";
import AssetLoad from "../utils/AssetLoad";
import { Enemy } from '../models/Enemy';

export class HeroController {
    public static instance: HeroController;
    private heroId: number;
    private map: Container;
    private levelData: LevelTypes;
    private gridMap: number[][];
    public target: Enemy[] = [];
    private isGameOver: boolean = false;
    hero!: Hero;

    constructor(id: number, map: Container, levelData: LevelTypes) {
        HeroController.instance = this;
        this.heroId = id;
        this.levelData = levelData;
        this.gridMap = levelData.map.tiles;
        this.map = map;

        this.heroInit();
    }

    heroInit() {
        const heroData = herosData.find(hero => hero.id === this.heroId);
        if (heroData) {
            this.hero = new Hero(heroData.id, heroData.name, heroData.speed, heroData.attackRange, heroData.maxHealth, heroData.maxMana, heroData.attackPower, heroData.defense);

            this.hero.moveDownTextures = AssetLoad.getAnimation(`hero1_move_down`);
            this.hero.moveLeftTextures = AssetLoad.getAnimation(`hero1_move_left`);
            this.hero.moveRightTextures = AssetLoad.getAnimation(`hero1_move_right`);
            this.hero.moveUpTextures = AssetLoad.getAnimation(`hero1_move_up`);

            this.hero.attackDownTextures = AssetLoad.getAnimation(`hero1_attack_down`);
            this.hero.attackLeftTextures = AssetLoad.getAnimation(`hero1_attack_left`);
            this.hero.attackRightTextures = AssetLoad.getAnimation(`hero1_attack_right`);
            this.hero.attackUpTextures = AssetLoad.getAnimation(`hero1_attack_up`);

            this.hero.sprite.x = this.levelData.waves[0].defendPoint.x * 64 + 32;
            this.hero.sprite.y = this.levelData.waves[0].defendPoint.y * 64 + 32;


            this.hero.spawnPosition(this.levelData.waves[0].defendPoint);


            this.hero.spriteAni.zIndex = 2;
            this.map.addChild(this.hero.sprite);
        }
    }

    moveToTarget(position: { x: number, y: number }) {
        const startPosition = { x: Math.floor(this.hero.sprite.x / 64), y: Math.floor(this.hero.sprite.y / 64) };
        const goalPosition = { x: Math.floor(position.x / 64), y: Math.floor(position.y / 64) };
        this.hero.setPosition(startPosition, goalPosition, this.gridMap);
        this.hero.spriteAni.play();
    }

    update(deltaTime: number) {
        if (this.hero) {
            this.hero.update(deltaTime);

            const enemiesInRange = EnemyController.instance.getEnemy().filter(enemy => enemy.isAlive && this.hero.checkInRange(enemy.getUpdatePositionEnemy()));
            enemiesInRange.forEach(enemy => {
                if (!this.target.includes(enemy)) {
                    this.target.push(enemy);
                }
            });

            if (this.target.length > 0) {
                let currentTarget = this.target[0];
                if (!currentTarget.isAlive || !this.hero.checkInRange(currentTarget.getUpdatePositionEnemy())) {
                    this.target.shift();
                } else {
                    if (!this.hero.isMoving) {
                        this.hero.attack(currentTarget);
                    } else {
                        this.hero.spriteAni.play();
                    }
                }
            }
        }
    }

}