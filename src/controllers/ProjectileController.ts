import { AnimatedSprite, Container, PointData } from "pixi.js";
import { Projectile } from "../models/Projectile";
import { TowerType } from "../types/TowerType";
import { Tower } from "../models/Tower";
import { Enemy } from "../models/Enemy";
import { ObjectPool } from "../utils/ObjectPool";
import AssetLoad from "../utils/AssetLoad";
import { DamageText } from "../scenes/displays/DamageText";
import { EventHandle } from "../utils/EventHandle";
import { GameTypes } from "../types/GameTypes";

export class ProjectileController {
    public static instance: ProjectileController;

    private projectiles: Projectile[] = [];
    private damageTexts: DamageText[] = [];

    constructor() {
        ProjectileController.instance = this
    }


    public createProjectile(tower: Tower, enemy: Enemy) {
        const projectile = ObjectPool.instance.getProjectileFromPool(tower.projectileType);

        projectile.sprite.x = tower.weapon.x;
        projectile.sprite.y = tower.weapon.y;

        projectile.setTarget(enemy, tower.damage);

        this.projectiles.push(projectile);

        projectile.sprite.zIndex = 100;
        EventHandle.emit(GameTypes.event.addChildToMap, (projectile.sprite));
    }

    public removeProjectile(projectileType: string, projectile: Projectile) {
        const index = this.projectiles.indexOf(projectile);

        if (index !== -1) {
            this.projectiles.splice(index, 1);

            ObjectPool.instance.returnProjectileToPool(projectileType, projectile);
            EventHandle.emit(GameTypes.event.removeChildFromMap, (projectile.sprite));
        }
    }

    public update(deltaTime: number) {
        this.projectiles.forEach((projectile) => {
            projectile.update(deltaTime);
        });

        this.damageTexts = this.damageTexts.filter((damageText) => {
            const stillAlive = !damageText.update(deltaTime);
            if (!stillAlive) {
                damageText.removeFrom();
            }
            return stillAlive;
        });
    }

    public createImpactEffect(projectileType: string, x: number, y: number) {
        const impactEffect = ObjectPool.instance.getImpactEffectFromPool(projectileType);
        impactEffect.gotoAndStop(0);
        impactEffect.x = x;
        impactEffect.y = y;
        impactEffect.animationSpeed = 0.5;
        impactEffect.loop = false;
        impactEffect.play();
        impactEffect.zIndex = 100;
        EventHandle.emit(GameTypes.event.addChildToMap, (impactEffect));

        impactEffect.onFrameChange = () => {
            if (impactEffect.currentFrame === impactEffect.totalFrames - 1) {
                ObjectPool.instance.returnImpactEffectToPool(projectileType, impactEffect);
                EventHandle.emit(GameTypes.event.removeChildFromMap, (impactEffect));
            }
        }
    }

    // Tạo DamageText tại vị trí enemy khi bị va chạm
    public displayDamage(damage: number, x: number, y: number) {
        const damageText = new DamageText(damage, x, y);
        damageText.addTo();
        this.damageTexts.push(damageText);
    }
}