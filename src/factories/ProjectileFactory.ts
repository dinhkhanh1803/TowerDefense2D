import { Sprite } from "pixi.js";
import { Projectile } from "../models/Projectile";
import { TowerType } from "../types/TowerType";
import AssetLoad from "../utils/AssetLoad";

export class ProjectileFactory {
    public static instance: ProjectileFactory;
    private static idProjectile: number = 0;

    constructor() {
        ProjectileFactory.instance = this;
    }

    public static createProjectile(type: string): Projectile {
        const id = this.idProjectile++;
        const sprite = new Sprite(AssetLoad.getTexture(`${type}_lv1_01`));
        return new Projectile(id, sprite, type);
    }
}