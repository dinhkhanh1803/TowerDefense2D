import { AnimatedSprite, Container, Graphics, Sprite, Texture } from "pixi.js";
import { TowerType } from "../types/TowerType";
import { Tower } from "../models/Tower";
import { ObjectPool } from "../utils/ObjectPool";
import AssetLoad from "../utils/AssetLoad";
import { GameBoard } from "../scenes/GameBoard";
import { EnemyController } from "./EnemyController";
import { towersData } from "../data/towers";
import { TowerInfoPannel } from "../scenes/systempannels/TowerInfoPannel";
import { TowerSelectionPannel } from "../scenes/systempannels/TowerSelectionPannel";
import { EventHandle } from "../utils/EventHandle";
import { GameTypes } from "../types/GameTypes";


export class TowerController {
    public static instance: TowerController;
    private towers: Tower[] = [];
    public rangeSprite!: Sprite;


    constructor() {
        TowerController.instance = this;
    }

    createTower(towerType: TowerType, baseSprite: Sprite) {
        const tower = ObjectPool.instance.getTowerFromPool(towerType);

        const towerData = towersData.find(t => t.name === towerType);
        if (towerData) {
            tower.reset(towerData.damage, towerData.range, towerData.fireRate, towerData.cost);
        }

        baseSprite.removeAllListeners();
        EventHandle.emit(GameTypes.event.removeChildFromMap, (baseSprite));

        tower.sprite.texture = AssetLoad.getTexture(`${towerType}_01`);
        tower.sprite.position = baseSprite.position;
        tower.towerContainer.addChild(tower.sprite);

        tower.weapon = new AnimatedSprite(AssetLoad.getAnimation(`${towerType}_lv1`));
        tower.weapon.x = baseSprite.position.x + 30;
        tower.weapon.y = baseSprite.position.y + 25;
        tower.weapon.anchor.set(0.5);
        tower.weapon.animationSpeed = 0.1;
        tower.towerContainer.addChild(tower.weapon);

        tower.towerContainer.interactive = true;
        tower.towerContainer.cursor = 'pointer';
        tower.towerContainer.on('pointerup', () => {
            EventHandle.emit(GameTypes.event.removeChildFromMap, (this.rangeSprite));
            if (!TowerInfoPannel.instance.isShowPanel) {
                TowerInfoPannel.instance.showPanel(tower);
            } else {
                TowerInfoPannel.instance.inforTower(tower);
            }

        });
        this.towers.push(tower);
        EventHandle.emit(GameTypes.event.addChildToMap, (tower.towerContainer));
    }

    removeTower(tower: Tower) {
        const idx = this.towers.indexOf(tower);

        if (idx !== -1) {
            this.towers.splice(idx, 1);

            tower.towerContainer.removeChildren();
            EventHandle.emit(GameTypes.event.removeChildFromMap, (tower.towerContainer));
            ObjectPool.instance.returnTowerToPool(tower.name, tower);
        }

        const slotTowerSprite = new Sprite(Texture.from('slot_tower'));
        slotTowerSprite.position = tower.sprite.position;
        slotTowerSprite.interactive = true;
        slotTowerSprite.eventMode = 'static';
        slotTowerSprite.cursor = 'pointer';

        slotTowerSprite.on('pointerup', () => {
            TowerSelectionPannel.instance.slotTower = slotTowerSprite;
            TowerSelectionPannel.instance.showPanel();
        });

        EventHandle.emit(GameTypes.event.addChildToMap, (slotTowerSprite));
    }

    upgradeTower(id: number) {
        const tower = this.towers.find(tower => tower.id === id);
        if (tower) {
            tower.upgrade();
        }
    }

    update(deltaTime: number) {
        this.towers.forEach(tower => {
            const targetInRange = EnemyController.instance
                .getEnemy()
                .filter(
                    enemy =>
                        enemy.isAlive &&
                        tower.isInRange(enemy.getUpdatePositionEnemy()
                        ));

            targetInRange.forEach(enemy => {
                if (!tower.targets.includes(enemy)) {
                    tower.targets.push(enemy);
                }
            });

            if (tower.targets.length > 0) {
                const target = tower.targets[0];
                if (!target.isAlive || !tower.isInRange(target.getUpdatePositionEnemy())) {
                    tower.targets.shift();
                    tower.weapon.gotoAndStop(0);
                } else {
                    tower.setTarget(target);
                    tower.update(deltaTime);
                    tower.weapon.play();
                }
            }
        });
    }
}