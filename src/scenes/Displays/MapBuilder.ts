import { applyMatrix, BitmapText, Container, Graphics, Sprite, Texture } from "pixi.js";
import { TowerSelectionPannel } from "../systempannels/TowerSelectionPannel";
import { TowerInfoPannel } from "../systempannels/TowerInfoPannel";
import { LevelTypes } from "../../types/LevelTypes";
import { EnemyController } from "../../controllers/EnemyController";
import { EventHandle } from "../../utils/EventHandle";
import { SkillSystemPannel } from "../systempannels/SkillSystemPannel";
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
                EventHandle.emit(GameTypes.event.movePosition, x, y);
            }

            if (SkillSystemPannel.instance.isSkillSelected) {
                EventHandle.emit(GameTypes.event.skillPosition, x, y);
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
        let posX = x + 32;
        let posY = y + 32;

        const spawnWaveContainer = new Container();

        if (posX === 32) {
            spawnWaveContainer.x += 50;
        } else if (posX === 992) {
            spawnWaveContainer.x -= 50;
        }

        if (posY === 32) {
            spawnWaveContainer.y += 10;
        } else if (posY === 608) {
            spawnWaveContainer.y -= 10;
        }

        const noticePanl = new Sprite(AssetLoad.getTexture('start_wave_notice'));
        noticePanl.anchor.set(0.5);
        noticePanl.scale.set(0.4);
        noticePanl.position.set(posX, posY);

        const noticeText = new BitmapText({
            text: "press the 'Start Wave' button to \nspawn the enemies!",
            style: {
                fontFamily: '',
                fontSize: 10,
                fill: '#000000',
                align: 'center'
            }
        });
        noticeText.position.set(posX, posY);
        noticeText.anchor.set(0.5);

        const spawnButton = new Sprite(AssetLoad.getTexture('start_wave_btn'));
        spawnButton.scale.set(0.25);
        spawnButton.anchor.set(0.5);
        spawnButton.position.set(posX, posY + 30);
        spawnButton.interactive = true;
        spawnButton.eventMode = 'static';
        spawnButton.cursor = 'pointer';

        spawnButton.once('pointerdown', () => {
            EnemyController.instance.spawnEnemyFromLevel(this.levelData);
            spawnWaveContainer.visible = false;
        });

        spawnWaveContainer.addChild(noticePanl);
        spawnWaveContainer.addChild(noticeText);
        spawnWaveContainer.addChild(spawnButton);
        EventHandle.emit(GameTypes.event.addChildToMap, (spawnWaveContainer));
    }

    private createDefenseSprite(x: number, y: number): void {
        const defenseSprite = new Sprite(AssetLoad.getTexture('point_defense'));
        defenseSprite.position.set(x + 32, y + 32);
        defenseSprite.anchor.set(0.5);
        defenseSprite.alpha = 0.8;


        EventHandle.emit(GameTypes.event.addChildToMap, (defenseSprite));
    }
}