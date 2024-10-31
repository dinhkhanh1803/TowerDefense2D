import { AnimatedSprite, Container, PointData } from "pixi.js";
import { Projectile } from "../models/Projectile";
import { TowerType } from "../types/TowerType";
import { Tower } from "../models/Tower";
import { Enemy } from "../models/Enemy";
import { ObjectPool } from "../utils/ObjectPool";
import AssetLoad from "../utils/AssetLoad";

export class ProjectileController {
    public static instance: ProjectileController;
    public objectPool: ObjectPool;
    private map: Container;
    private projectiles: Projectile[] = [];
    private target!: Enemy;

    constructor(map: Container) {
        ProjectileController.instance = this;
        this.objectPool = new ObjectPool();
        this.map = map;
    }


    createProjectile(tower: Tower, enemy: Enemy) {
        const projectile = ObjectPool.instance.getProjectileFromPool(tower.projectileType);

        projectile.sprite.x = tower.weapon.x;
        projectile.sprite.y = tower.weapon.y;

        projectile.setTarget(enemy, tower.damage);

        this.projectiles.push(projectile);

        projectile.sprite.zIndex = 100;
        this.map.addChild(projectile.sprite);
    }

    removeProjectile(projectileType: string, projectile: Projectile) {
        const index = this.projectiles.indexOf(projectile);

        if (index !== -1) {
            this.projectiles.splice(index, 1);

            ObjectPool.instance.returnProjectileToPool(projectileType, projectile);
            this.map.removeChild(projectile.sprite);
        }
    }

    update(deltaTime: number) {
        this.projectiles.forEach((projectile) => {
            projectile.update(deltaTime);
        });
    }

    createImpactEffect(projectileType: string, x: number, y: number) {
        const impactEffect = ObjectPool.instance.getImpactEffectFromPool(projectileType);
        impactEffect.gotoAndStop(0);
        impactEffect.x = x;
        impactEffect.y = y;
        impactEffect.animationSpeed = 0.5;
        impactEffect.loop = false;
        impactEffect.play();
        impactEffect.zIndex = 100;
        this.map.addChild(impactEffect);

        impactEffect.onFrameChange = () => {
            if (impactEffect.currentFrame === impactEffect.totalFrames - 1) {
                ObjectPool.instance.returnImpactEffectToPool(projectileType, impactEffect);
                this.map.removeChild(impactEffect);
            }
        }
    }
}