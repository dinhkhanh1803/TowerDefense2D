import { Tower } from './../models/Tower';
import { EnemyFactory } from "../factories/EnemyFactory";
import { Enemy } from "../models/Enemy";
import { EnemyTypes } from "../types/EnemyTypes";
import { TowerType } from '../types/TowerType';
import { TowerFactory } from '../factories/TowerFactory';
import { Projectile } from '../models/Projectile';
import { ProjectileFactory } from '../factories/ProjectileFactory';
import { ProjectileType } from '../types/ProjectileTypes';
import { AnimatedSprite } from 'pixi.js';
import AssetLoad from './AssetLoad';


export class ObjectPool {
    public static instance: ObjectPool;
    private poolSize: number = 10;

    private _towerPool: { [towerType: string]: Tower[] } = {};
    private _enemyPool: { [enemyType: string]: Enemy[] } = {};
    private _projectilePool: { [projectileType: string]: Projectile[] } = {};
    private _impactEffectPool: { [projectileType: string]: AnimatedSprite[] } = {};

    constructor() {
        ObjectPool.instance = this;

        // Lặp qua các EnemyTypes để tạo pool cho mỗi loại kẻ địch
        Object.values(EnemyTypes).forEach((enemyType) => {
            this._enemyPool[enemyType] = [];
            for (let i = 0; i < this.poolSize; i++) {
                const enemy = EnemyFactory.createEnemy(enemyType);
                if (enemy) {
                    this._enemyPool[enemyType].push(enemy);
                } else {
                    console.error(`Không thể tạo kẻ địch với loại ${enemyType}`);
                }
            }
        });

        Object.values(TowerType).forEach((towerType) => {
            this._towerPool[towerType] = [];
            for (let i = 0; i < this.poolSize; i++) {
                const tower = TowerFactory.createTower(towerType);
                if (tower) {
                    this._towerPool[towerType].push(tower);
                } else {
                    console.error(`Không thể tạo công trình với loại ${towerType}`);
                }
            }
        });

        Object.values(ProjectileType).forEach((projectileType) => {
            this._projectilePool[projectileType] = [];
            for (let i = 0; i < this.poolSize; i++) {
                const projectile = ProjectileFactory.createProjectile(projectileType);
                if (projectile) {
                    this._projectilePool[projectileType].push(projectile);
                } else {
                    console.error(`Không thể tạo đạn với loại ${projectileType}`);
                }
            }

            this._impactEffectPool[projectileType] = [];
            for (let i = 0; i < this.poolSize; i++) {
                const impactEffect = this.createImpactEffect(projectileType);
                if (impactEffect) {
                    this._impactEffectPool[projectileType].push(impactEffect);
                } else {
                    console.error(`Không thể tạo hiệu ứng va chạm cho ${projectileType}`);
                }
            }
        });
    }
    // Hàm lấy kẻ địch từ pool
    public getEnemyFromPool(enemyType: string): Enemy {
        if (this._enemyPool[enemyType] ?.length <= 0) {
            const enemy = EnemyFactory.createEnemy(enemyType);
            if (enemy) {
                return enemy;
            } else {
                throw new Error(`Không thể tạo kẻ địch mới cho loại ${enemyType}`);
            }
        } else {
            return this._enemyPool[enemyType].pop() as Enemy;
        }
    }

    // Hàm trả kẻ địch về pool
    public returnEnemyToPool(enemyType: string, enemy: Enemy): void {
        this._enemyPool[enemyType].push(enemy);
    }

    // Hàm lấy tower từ pool
    public getTowerFromPool(towerType: string): Tower {
        if (this._towerPool[towerType] ?.length <= 0) {
            const tower = TowerFactory.createTower(towerType);
            if (tower) {
                return tower;
            } else {
                throw new Error(`Không thể tạo tower mới cho loại ${towerType}`);
            }
        } else {
            return this._towerPool[towerType].pop() as Tower;
        }
    }

    // Hàm trả tower về pool
    public returnTowerToPool(towerType: string, tower: Tower): void {
        this._towerPool[towerType].push(tower);
    }

    // Hàm lấy Projectile từ pool
    public getProjectileFromPool(projectileType: string): Projectile {
        if (this._projectilePool[projectileType] ?.length <= 0) {
            const projectile = ProjectileFactory.createProjectile(projectileType);

            if (projectile) {
                return projectile;
            } else {
                throw new Error(`Không thể tạo projectile mới cho loại ${projectileType}`);
            }
        } else {
            return this._projectilePool[projectileType].pop() as Projectile;
        }
    }

    // Hàm trả projectile về pool
    public returnProjectileToPool(projectileType: string, projectile: Projectile) {
        this._projectilePool[projectileType].push(projectile);
    }

    // Hàm tạo hiệu ứng va chạm cho mỗi loại projectile
    private createImpactEffect(projectileType: string): AnimatedSprite {
        const impactEffect = new AnimatedSprite(AssetLoad.getAnimation(`${projectileType}_impact`));
        return impactEffect;
    }

    // Hàm lấy hiệu ứng va chạm từ pool
    public getImpactEffectFromPool(projectileType: string): AnimatedSprite {
        if (this._impactEffectPool[projectileType] ?.length <= 0) {
            const impactEffect = this.createImpactEffect(projectileType);
            return impactEffect;
        } else {
            return this._impactEffectPool[projectileType].pop() as AnimatedSprite;
        }
    }

    // Hàm trả hiệu ứng va chạm về pool
    public returnImpactEffectToPool(projectileType: string, impactEffect: AnimatedSprite): void {
        this._impactEffectPool[projectileType].push(impactEffect);
    }
}