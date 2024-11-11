import { applyMatrix, Container, Graphics, Sprite, Texture } from "pixi.js";
import { TowerSelectionPannel } from "../TowerSelectionPannel";
import { TowerInfoPannel } from "../TowerInfoPannel";
import { LevelTypes } from "../../types/LevelTypes";
import { EnemyController } from "../../controllers/EnemyController";
import { EventHandle } from "../../utils/EventHandle";
import { SkillSystemPannel } from "../SkillSystemPannel";
import { GameTypes } from "../../types/GameTypes";
import { GameBoard } from "../GameBoard";
import AssetLoad from "../../utils/AssetLoad";

export class MapBuilder {
    private levelData: LevelTypes;

    constructor(levelData: LevelTypes) {
        this.levelData = levelData;

        this.buildMap();
    }

    public buildMap(): void {
        const pointX = 1024 / 2;
        const pointY = 640 / 2;
        this.loadMapLevel(pointX, pointY, `load_map_0${this.levelData.levelNumber}`);
        this.levelData.map.tiles.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                const x = colIndex * 64;
                const y = rowIndex * 64;
                switch (tile) {
                    case 0:
                        //this.createEmptyTile(x, y);
                        break;
                    case 1:
                        this.createPathTile(x, y);
                        break;
                    case 2:
                        this.createTowerTile(x, y);
                        break;
                    default:
                        console.error(`Invalid tile value at [${rowIndex}, ${colIndex}]: ${tile}`);
                        break;
                }
            });
        });

        const pointStart = this.levelData.waves[0].spawnPoints;
        for (let i = 0; i < pointStart.length; i++) {
            const x = pointStart[i].x * 64;
            const y = pointStart[i].y * 64;
            this.createStartSpawnTile(x, y);
        }

        const pointDefense = this.levelData.waves[0].defendPoint;
        this.createDefenseSprite(pointDefense.x * 64, pointDefense.y * 64);
    }

    private loadMapLevel(x: number, y: number, texture: string) {
        const map = new Sprite(Texture.from(texture));
        map.anchor.set(0.5);
        map.position.x = x;
        map.position.y = y;
        map.interactive = true;
        map.eventMode = 'static';
        map.on('pointerdown', () => {
            if (GameBoard.instance.isGameOver) return;
            TowerSelectionPannel.instance.visible = false;
            TowerInfoPannel.instance.visible = false;
            SkillSystemPannel.instance.resetAvtHero();
        });
        EventHandle.emit(GameTypes.event.addChildToMap, (map));
    }

    private createPathTile(x: number, y: number) {
        const transparentTexture = Texture.WHITE;
        const path = new Sprite(transparentTexture);

        path.width = 64;
        path.height = 64;
        path.alpha = 0;
        path.position.set(x, y);
        path.interactive = true;
        path.eventMode = 'static';

        path.on('pointerdown', () => {
            if (GameBoard.instance.isGameOver) return;
            TowerSelectionPannel.instance.visible = false;
            TowerInfoPannel.instance.visible = false;

            if (SkillSystemPannel.instance.isHeroSelected) {
                EventHandle.emit('postion_click', x, y);
            }

            if (SkillSystemPannel.instance.isSkillSelected) {
                EventHandle.emit('postion_skill_click', x, y);
            }
        });
        EventHandle.emit(GameTypes.event.addChildToMap, (path));
    }

    private createTowerTile(x: number, y: number) {
        const slotTowerSprite = new Sprite(Texture.from('slot_tower'));

        slotTowerSprite.position.set(x, y);
        slotTowerSprite.interactive = true;
        slotTowerSprite.eventMode = 'static';
        slotTowerSprite.cursor = 'pointer';

        slotTowerSprite.on('pointerdown', () => {
            if (GameBoard.instance.isGameOver) return;
            TowerSelectionPannel.instance.slotTower = slotTowerSprite;
            TowerSelectionPannel.instance.menuTower();
        });
        EventHandle.emit(GameTypes.event.addChildToMap, (slotTowerSprite));
    }

    private createEmptyTile(x: number, y: number) {
        const grap = new Graphics();
        grap.rect(x, y, 64, 64);
        grap.fill(0x72BF78);
        grap.interactive = true;
        grap.on('pointerdown', () => {
            if (GameBoard.instance.isGameOver) return;
            TowerSelectionPannel.instance.visible = false;
            TowerInfoPannel.instance.visible = false;
        });
        EventHandle.emit(GameTypes.event.addChildToMap, (grap));
    }

    // Tạo nút Start Spawn tại vị trí cụ thể
    private createStartSpawnTile(x: number, y: number): void {
        const spawnButton = new Sprite(AssetLoad.getTexture('ui-wave'));
        spawnButton.scale.set(0.8);
        spawnButton.position.set(x, y);
        spawnButton.interactive = true;
        spawnButton.eventMode = 'static';
        spawnButton.cursor = 'pointer';

        spawnButton.once('pointerdown', () => {
            EnemyController.instance.spawnEnemyFromLevel(this.levelData);
            spawnButton.visible = false;
        });
        EventHandle.emit(GameTypes.event.addChildToMap, (spawnButton));
    }

    private createDefenseSprite(x: number, y: number): void {
        const defenseSprite = new Sprite(AssetLoad.getTexture('point_defense'));
        defenseSprite.position.set(x, y);
        defenseSprite.alpha = 0.8;


        EventHandle.emit(GameTypes.event.addChildToMap, (defenseSprite));
    }
}