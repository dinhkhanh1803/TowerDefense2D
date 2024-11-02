import { AnimatedSprite, Container, Graphics, PointData, Sprite, Texture } from "pixi.js";
import { BfsPathfinding } from "../utils/BfsPathfinding";
import { EnemyController } from "../controllers/EnemyController";
import AssetLoad from "../utils/AssetLoad";
import { PlayerController } from "../controllers/PlayerController";

export class Enemy {
    id: number;
    name: string;
    sprite: Container = new Container();
    healthBar: Container = new Container();
    spriteAni: AnimatedSprite;
    hp: number;
    maxHp: number;
    speed: number;
    damage: number;
    reward: number;
    position!: { x: number, y: number }
    currentPosition!: { x: number, y: number };
    goalPosition!: { x: number, y: number };
    pathfinding!: BfsPathfinding;
    currentPathIndex: number = 0;
    isAlive: boolean;
    healthBarDown!: Sprite;
    healthBarUp!: Sprite;

    moveLeftTextures!: Texture[];
    moveRightTextures!: Texture[];
    moveDownTextures!: Texture[];
    moveUpTextures!: Texture[];
    hpbardown!: Texture;
    hpbarup!: Texture;

    constructor(
        id: number,
        name: string,
        hp: number,
        speed: number,
        damage: number,
        reward: number,
    ) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.speed = speed;
        this.damage = damage;
        this.reward = reward;
        this.isAlive = true;

        this.spriteAni = new AnimatedSprite([Texture.EMPTY]);
        this.spriteAni.anchor.set(0.5);
        this.spriteAni.animationSpeed = 0.1;
        this.spriteAni.anchor.set(0.5, 0.5);
        this.spriteAni.play();
        this.sprite.addChild(this.spriteAni);

        this.sprite.addChild(this.healthBar);
    }

    setPosition(pointStart: { x: number, y: number }, pointEnd: { x: number, y: number }, path: BfsPathfinding) {
        this.currentPosition = { x: pointStart.x, y: pointStart.y };
        this.goalPosition = { x: pointEnd.x, y: pointEnd.y };
        this.pathfinding = path;
        this.currentPathIndex = 0;

        this.healthBarDown = new Sprite(this.hpbardown);
        this.healthBarUp = new Sprite(this.hpbarup);

        this.healthBarDown.position.set(this.sprite.x - 45, this.sprite.y - 130);
        this.healthBar.addChild(this.healthBarDown);

        this.healthBarUp.position.set(this.sprite.x - 45, this.sprite.y - 130);
        this.healthBar.addChild(this.healthBarUp);
    }

    takeDamage(id: number, damage: number) {
        if (id === this.id) {
            this.hp -= damage;

            if (this.hp <= 0) {
                this.hp = 0;
                this.isAlive = false;

                PlayerController.instance.addGold(this.reward);
                EnemyController.instance.removeEnemy(this);
            }

            const healthPer = this.hp / this.maxHp;
            this.healthBarUp.scale.x = healthPer;
        }
    }

    update(deltaTime: number) {
        const path = this.pathfinding.bfs(this.currentPosition, this.goalPosition);

        if (path && this.currentPathIndex < path.length) {

            const target = path[this.currentPathIndex];
            const tileCenterX = (target.x * 64) + (64 / 2); // Thêm 64/2 để vào giữa ô
            const tileCenterY = (target.y * 64) + (64 / 2); // Thêm 64/2 để vào giữa ô

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

    updateAnimation(dx: number, dy: number) {
        // Cập nhật animation theo hướng di chuyển
        let newTexture;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                newTexture = this.moveRightTextures;
            } else {
                newTexture = this.moveLeftTextures;
            }
        } else {
            if (dy > 0) {
                newTexture = this.moveDownTextures;
            } else {
                newTexture = this.moveUpTextures;
            }
        }

        // Chỉ thay đổi textures khi cần thiết
        if (this.spriteAni.textures !== newTexture) {
            this.spriteAni.textures = newTexture;
            this.spriteAni.play();
        }

        this.spriteAni.animationSpeed = 0.1;
    }
}
