import { AnimatedSprite, PointData, Sprite } from "pixi.js";
import { TowerType } from "../types/TowerType";
import AssetLoad from "../utils/AssetLoad";
import { Enemy } from "./Enemy";
import { ProjectileController } from "../controllers/ProjectileController";
import { ObjectPool } from "../utils/ObjectPool";
import { EventHandle } from "../utils/EventHandle";

export class Projectile {
    id: number;
    sprite: Sprite;
    damage: number;
    speed: number;
    type: string;
    target!: Enemy;

    lightAni: AnimatedSprite;

    constructor(id: number, sprite: Sprite, type: string) {
        this.id = id;
        this.type = type;
        this.sprite = sprite;
        this.sprite.scale.set(0.5);
        this.sprite.anchor.set(1, 0.5);
        this.damage = 0;
        this.speed = 8;

        this.lightAni = new AnimatedSprite(AssetLoad.getAnimation("lightning_lv1"));
        this.lightAni.animationSpeed = 0.2;
        this.lightAni.loop = false;
    }

    setTarget(enemyTarget: Enemy, damage: number) {
        this.target = enemyTarget;
        this.damage = damage;
        if (this.type === 'lightning') {
            this.lightAni.gotoAndPlay(0);
        }
    }

    update(deltaTime: number): void {
        this.target.getUpdatePositionEnemy();

        if (this.type === 'lightning') {
            this.hitLightning();
        } else {
            this.moveToTarget(deltaTime);
        }
    }

    // Hàm riêng cho sát thương của lightning
    private hitLightning(): void {
        const dx = this.sprite.x - this.target.sprite.x;
        const dy = this.sprite.y - this.target.sprite.y;

        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        this.sprite.width = length;
        this.sprite.rotation = angle;

        this.lightAni.onFrameChange = () => {
            if (this.lightAni.currentFrame === this.lightAni.totalFrames - 1) {
                this.hit();
            }
        };
    }

    // Hàm di chuyển và kiểm tra va chạm cho các loại đạn khác
    private moveToTarget(deltaTime: number): void {
        const dx = this.target.sprite.x - this.sprite.x;
        const dy = this.target.sprite.y - this.sprite.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        this.sprite.rotation = Math.atan2(dy, dx);

        if (distance < this.speed * deltaTime) {
            this.hit();
        } else {
            this.sprite.x += (dx / distance) * this.speed * deltaTime;
            this.sprite.y += (dy / distance) * this.speed * deltaTime;
        }
    }

    // Gây sát thương khi va chạm
    private hit(): void {
        const impactX = this.target.sprite.x;
        const impactY = this.target.sprite.y;
        const targetId = this.target.id;
        const damage = Math.round(this.damage * (0.8 + Math.random() * 0.4));

        this.target.takeDamage(targetId, damage);
        ProjectileController.instance.createImpactEffect(this.type, impactX, impactY);
        EventHandle.emit('play-sound', 'effect_sound', {
            sprite: 'slash',
            loop: false,
            volume: 0.8
        });

        ProjectileController.instance.displayDamage(damage, impactX, impactY);
        ProjectileController.instance.removeProjectile(this.type, this);
    }
}
