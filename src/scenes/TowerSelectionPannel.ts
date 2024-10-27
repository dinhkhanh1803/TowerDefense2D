import { Container, Graphics, Sprite } from "pixi.js";
import { TowerType } from "../types/TowerType";
import AssetLoad from "../utils/AssetLoad";
import { PlayerController } from "../controllers/PlayerController";
import { TowerInfoPannel } from "./TowerInfoPannel";

export class TowerSelectionPannel extends Container {
    public static instance: TowerSelectionPannel;
    public slotTower!: Sprite;

    constructor() {
        super();
        TowerSelectionPannel.instance = this;
        this.visible = false;
    }

    menuTower() {
        TowerInfoPannel.instance.visible = false;
        this.visible = true;

        const grapbg = new Graphics();
        grapbg.rect(0, 640, 1024, 160);
        grapbg.fill(0xFEF9F2);
        this.addChild(grapbg);

        const towerType: TowerType[] = [TowerType.Archer, TowerType.Mage, TowerType.Fire, TowerType.Ice, TowerType.Cannon];
        const startX = 50;
        const startY = 660;
        const cardSpacing = 20;

        for (let i = 0; i < towerType.length; i++) {
            const cardX = startX + i * (100 + cardSpacing);
            const cardY = startY;
            const card = this.createCardTower(towerType[i], cardX, cardY);
            this.addChild(card);
        }
    }

    createCardTower(type: TowerType, x: number, y: number): Container {
        const card = new Container();
        const cardTower = new Sprite(AssetLoad.getTexture('card_tower'));
        cardTower.scale.set(0.5);
        cardTower.position.set(x, y);
        const spriteTower = new Sprite(AssetLoad.getTexture(`${type}_01`));
        spriteTower.position.set(x + 20, y + 5);

        spriteTower.interactive = true;
        spriteTower.cursor = 'pointer';
        spriteTower.on('pointerdown', () => {
            PlayerController.instance.buyTower(type, this.slotTower);
            this.visible = false;
        });
        card.addChild(cardTower);
        card.addChild(spriteTower);
        return card;
    }
}