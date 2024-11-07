import { Sprite } from "pixi.js";
import { levels } from "../data/levels";
import { Player } from "../models/Player";
import { TowerType } from "../types/TowerType";
import { towersData } from "../data/towers";
import { TowerController } from "./TowerController";
import { GameBoard } from "../scenes/GameBoard";
import { Tower } from "../models/Tower";
import { HUD } from "../scenes/Displays/HUD";
import { EnemyController } from "./EnemyController";
import { EventHandle } from "../utils/EventHandle";
import { MapScene } from "../scenes/MapScene";
import { Game } from "../game";

export class PlayerController {
    public static instance: PlayerController;
    private player!: Player;
    private currentLevel: number;
    private currentWave: number;
    private isGameOver: boolean = false;

    constructor(idLevel: number) {
        PlayerController.instance = this;
        this.currentWave = 0;
        this.currentLevel = idLevel;

        const levelData = levels.find(lv => lv.levelNumber == this.currentLevel);
        if (levelData) {
            this.player = new Player(levelData.resources.gold, levelData.resources.health, levelData.waves.length);
        }
    }


    buyTower(towerType: TowerType, baseSprite: Sprite) {
        const tower = towersData.find(t => t.name === towerType);
        if (tower && this.player.coin >= tower.cost) {
            TowerController.instance.createTower(towerType, baseSprite);
            this.consumeGold(tower.cost);
        } else {
            console.log("Not enough gold");
        }
    }

    sellTower(tower: Tower, amount: number) {
        const costSell = amount * 0.8;
        TowerController.instance.removeTower(tower);
        this.addGold(costSell);
    }

    upgradeTower(idTower: number, level: number, amount: number) {
        if (level < 3 && amount <= this.player.coin) {
            TowerController.instance.upgradeTower(idTower);
            this.consumeGold(amount);
        }
    }

    consumeGold(amount: number) {
        this.player.consumeResources(amount);
        HUD.instance.updateHUD();
    }

    addGold(amount: number) {
        this.player.addResources(amount);
        HUD.instance.updateHUD();
    }

    // Nhan damage khi enemy di vao thanh
    takeDamage(amount: number) {
        if (this.player.health >= amount) {
            this.player.takeDamage(amount);
            HUD.instance.updateHUD();

            if (this.player.health === 0) {
                this.isGameOver = true;
                EventHandle.emit('gameResult', false, this.getHealthPercentage());
            }
        }
    }

    checkWin() {
        if (!this.isGameOver && this.getCurrentWave() === this.getWaves()) {
            if (this.player.health > 0) {
                Game.instance.unlockNextLevel(this.currentLevel);
                EventHandle.emit('gameResult', true, this.getHealthPercentage());
            }
        }
    }

    updateCurrentWave(wave: number) {
        this.currentWave = wave;
        HUD.instance.updateHUD();
    }
    // Getter cho thông tin Player
    public getHealth(): number {
        return this.player.health;
    }

    public getGold(): number {
        return this.player.coin;
    }

    public getWaves(): number {
        return this.player.wave;
    }

    public getCurrentWave(): number {
        return this.currentWave;
    }

    getHealthPercentage(): number {
        return (this.getHealth() / this.player.maxHealth) * 100;
    }
}