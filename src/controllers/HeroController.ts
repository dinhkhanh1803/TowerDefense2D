import { Container } from "pixi.js";
import { herosData } from "../data/heros";
import { Hero } from "../models/Hero";
import { LevelTypes } from "../types/LevelTypes";
import { BfsPathfinding } from "../utils/BfsPathfinding";
import { Tween } from "@tweenjs/tween.js";
import { EventHandle } from "../utils/EventHandle";

export class HeroController {
    public static instance: HeroController;
    private heroId: number;
    private map: Container;
    private levelData: LevelTypes;
    private gridMap: number[][];
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
            this.hero = new Hero(heroData.id, heroData.name, heroData.speed, heroData.attackRadius, heroData.maxHp, heroData.maxMp, heroData.attackPower, heroData.defense);

            this.hero.sprite.x = this.levelData.waves[0].defendPoint.x * 64 + 32;
            this.hero.sprite.y = this.levelData.waves[0].defendPoint.y * 64 + 32;


            this.hero.spawnPosition(this.levelData.waves[0].defendPoint);


            this.hero.sprite.zIndex = 2;
            this.map.addChild(this.hero.sprite);
        }
    }

    moveToTarget(position: { x: number, y: number }) {
        const startPosition = { x: Math.floor(this.hero.sprite.x / 64), y: Math.floor(this.hero.sprite.y / 64) };
        const goalPosition = { x: Math.floor(position.x / 64), y: Math.floor(position.y / 64) };
        this.hero.setPosition(startPosition, goalPosition, this.gridMap);
    }

    update(deltaTime: number) {
        this.hero.update(deltaTime);
    }
}