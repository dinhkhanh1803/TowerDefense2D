import { PointData, Sprite } from "pixi.js";
import { TowerType } from "../types/TowerType";
import AssetLoad from "../utils/AssetLoad";
import { Enemy } from "./Enemy";
import { ProjectileController } from "../controllers/ProjectileController";
import { ObjectPool } from "../utils/ObjectPool";

export class Projectile {
    id: number;
    sprite: Sprite;
    damage: number;
    speed: number;
    type: string;
    target!: Enemy;

    constructor(id: number, sprite: Sprite, type: string) {
        this.id = id;
        this.type = type;
        this.sprite = sprite;
        this.sprite.scale.set(0.5);
        this.sprite.anchor.set(1, 0.5);
        this.damage = 0;
        this.speed = 8;
    }

    setTarget(enemyTarget: Enemy, damage: number) {
        this.target = enemyTarget;
        this.damage = damage;
    }

    update(deltaTime: number): void {
        this.target.getUpdatePositionEnemy();

        if (this.type === 'lightning') {
            this.createLightningEffect()
        } else {
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
    }

    // Gây sát thương khi va chạm
    hit(): void {
        const impactX = this.target.sprite.x;
        const impactY = this.target.sprite.y;

        ProjectileController.instance.createImpactEffect(this.type, impactX, impactY);
        this.target.takeDamage(this.target.id, this.damage);
        ProjectileController.instance.removeProjectile(this.type, this);
    }

    private createLightningEffect(): void {
        const dx = this.sprite.x - this.target.sprite.x;
        const dy = this.sprite.y - this.target.sprite.y;

        // Tính độ dài và góc cho tia sét
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Cập nhật kích thước và góc của sprite
        this.sprite.width = length;
        this.sprite.rotation = angle;

        // Hiển thị sprite tia sét trong thời gian ngắn
        this.sprite.visible = true;
        // Đặt timeout để xóa sprite sau khi gây sát thương
        setTimeout(() => {
            this.sprite.visible = false; // Ẩn tia sét   
            this.hit();
        }, 50);
    }
}
