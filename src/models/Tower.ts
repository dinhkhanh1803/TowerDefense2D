import { AnimatedSprite, Container, PointData, Sprite, Texture } from "pixi.js";
import AssetLoad from "../utils/AssetLoad";
import { Enemy } from "./Enemy";
import { ProjectileController } from "../controllers/ProjectileController";
import { EventHandle } from "../utils/EventHandle";
import { GameTypes } from "../types/GameTypes";

export class Tower {
    public id: number;
    public name: string;
    public towerContainer: Container;
    public sprite: Sprite;
    public weapon: AnimatedSprite;
    public damage: number;
    public range: number;
    public fireRate: number;
    public cost: number;
    public level: number;
    public position!: { x: number; y: number };
    public projectileType: string;
    public targets: Enemy[] = [];
    public target!: Enemy;

    private cooldownTime: number;
    private attackTime: number;

    constructor(
        id: number,
        name: string,
        damage: number,
        range: number,
        fireRate: number,
        cost: number,
        projectileType: string
    ) {
        this.id = id;
        this.name = name;
        this.towerContainer = new Container();
        this.sprite = new Sprite(Texture.EMPTY);
        this.weapon = new AnimatedSprite([Texture.EMPTY]);
        this.damage = damage;
        this.range = range;
        this.fireRate = fireRate;
        this.cost = cost;
        this.level = 1;

        this.cooldownTime = this.fireRate;
        this.attackTime = 0;

        this.projectileType = projectileType;
    }

    reset(damage: number, range: number, fireRange: number, cost: number) {
        this.level = 1;
        this.damage = damage;
        this.range = range;
        this.fireRate = fireRange;
        this.cost = cost;
        this.cooldownTime = this.fireRate;
    }

    setTarget(target: Enemy) {
        this.target = target;
    }

    // Phương thức nâng cấp tháp
    upgrade(): void {
        this.level++;
        this.sprite.texture = AssetLoad.getTexture(`${this.name}_0${this.level}`);
        this.weapon.position.y -= 5;
        this.damage *= GameTypes.tower.damageUpgrade;
        this.range *= GameTypes.tower.rangeUpgrade;
        this.fireRate *= GameTypes.tower.speedUpgrade;
        this.cost *= GameTypes.tower.costUpgrade;

    }

    // Phương thức bắn đạn
    update(deltaTime: number): void {

        const dx = this.target.sprite.x - this.sprite.x;
        const dy = this.target.sprite.y - this.sprite.y;

        if (['Archer', 'Fire', 'Cannon'].includes(this.name)) {
            const angle = Math.atan2(dy, dx);
            this.weapon.rotation = angle + Math.PI / 2;
        }

        this.attackTime += deltaTime;
        if (this.attackTime >= this.cooldownTime) {
            ProjectileController.instance.createProjectile(this, this.target);
            EventHandle.emit(GameTypes.event.playSound, 'effect_sound', {
                sprite: this.name,
                loop: false,
                volume: 0.8
            });
            this.attackTime = 0;
        }
    }

    public isInRange(enemyPosition: PointData): boolean {
        const distance = Math.sqrt(
            Math.pow(enemyPosition.x - this.sprite.x, 2) +
            Math.pow(enemyPosition.y - this.sprite.y, 2)
        );
        return distance <= this.range;
    }
}