import { AnimatedSprite, Container, Graphics, PointData, Sprite, Texture } from "pixi.js";
import { bfsPathfinding } from "../utils/BfsPathfinding";
import { EnemyController } from "../controllers/EnemyController";
import { PlayerController } from "../controllers/PlayerController";
import { Character } from "./Character";
import AssetLoad from "../utils/AssetLoad";

export class Enemy extends Character {

    private reward: number;
    private position!: { x: number, y: number }

    constructor(
        id: number,
        name: string,
        maxHp: number,
        speed: number,
        damage: number,
        reward: number,
    ) {
        super(id, name, maxHp, speed, damage);
        this.reward = reward;


    }

    setPosition(pointStart: { x: number, y: number }, pointEnd: { x: number, y: number }, path: bfsPathfinding) {
        this.currentPosition = { x: pointStart.x, y: pointStart.y };
        this.goalPosition = { x: pointEnd.x, y: pointEnd.y };
        this.pathfinding = path;
        this.currentPathIndex = 0;
        this.updateHealthBar();
    }

    update(deltaTime: number) {
        const path = this.pathfinding.bfs(this.currentPosition, this.goalPosition);
        if (path && this.currentPathIndex < path.length) {
            this.moveAlongPath(path, deltaTime);
        }
    }

    private moveAlongPath(path: { x: number, y: number }[], deltaTime: number) {
        const target = path[this.currentPathIndex];
        const tileCenterX = (target.x * 64) + (64 / 2);
        const tileCenterY = (target.y * 64) + (64 / 2);

        const dx = tileCenterX - this.sprite.x;
        const dy = tileCenterY - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            this.sprite.x += (dx / dist) * this.speed * deltaTime;
            this.sprite.y += (dy / dist) * this.speed * deltaTime;
            this.updateAnimation(dx, dy);
        } else {
            this.currentPathIndex++;
        }
    }

    private updateAnimation(dx: number, dy: number) {
        let newTexture = this.getTextureBasedOnDirection(dx, dy);
        if (this.spriteAni.textures !== newTexture) {
            this.spriteAni.textures = newTexture;
            this.spriteAni.animationSpeed = 0.1;
            this.spriteAni.play();
        }
    }

    private getTextureBasedOnDirection(dx: number, dy: number): Texture[] {
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? this.moveRightTextures : this.moveLeftTextures;
        }
        return dy > 0 ? this.moveDownTextures : this.moveUpTextures;
    }


    takeDamage(id: number, damage: number) {
        if (id === this.id) {
            super.receiveDamage(damage);
            if (!this.isAlive) {
                PlayerController.instance.addGold(this.reward);
                EnemyController.instance.removeEnemy(this);
            }
        }
    }

    getUpdatePositionEnemy(): PointData {
        this.position = { x: this.sprite.x - 64 / 2, y: this.sprite.y - 64 / 2 };
        return this.position;
    }

    hasReachedGoal(): boolean {
        const dx = this.goalPosition.x * 64 + 32 - this.sprite.x;
        const dy = this.goalPosition.y * 64 + 32 - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < 1;
    }
}
