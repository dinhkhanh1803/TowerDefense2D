import { Container, Graphics, Sprite, Texture, Text, BitmapText, TextStyle } from "pixi.js";
import { Tower } from "../models/Tower";
import { PlayerController } from "../controllers/PlayerController";
import { TowerSelectionPannel } from "./TowerSelectionPannel";
import AssetLoad from "../utils/AssetLoad";


export class TowerInfoPannel extends Container {
    public static instance: TowerInfoPannel;
    private towerRange: Sprite;

    constructor() {
        super();
        TowerInfoPannel.instance = this;
        this.towerRange = new Sprite();
    }

    infoTower(tower: Tower) {
        TowerSelectionPannel.instance.visible = false;
        this.visible = true;
        this.towerRange.texture = AssetLoad.getTexture('range_tower');
        this.towerRange.anchor.set(0.5);
        this.towerRange.position.set(tower.sprite.x + 32, tower.sprite.y + 32);
        this.towerRange.width = tower.range * 2;
        this.towerRange.height = tower.range * 2;
        this.addChild(this.towerRange);

        const uiBoard = new Sprite(Texture.from('UI_board_info'));
        uiBoard.position.set(0, 640);
        this.addChild(uiBoard);

        const imageTower = new Sprite(AssetLoad.getTexture(`${tower.name}_0${tower.level}`));
        imageTower.scale.set(2);
        imageTower.anchor.set(0.5);
        imageTower.position.set(150, 710);
        this.addChild(imageTower);

        const nameTower = this.createText(220, 650, `${tower.name}`, 32, 'ShinyPeaberry');
        this.addChild(nameTower);

        const upgradeTowerBtn = this.createBtn(700, 690, 'upgrade_btn');
        upgradeTowerBtn.interactive = true;
        upgradeTowerBtn.cursor = 'pointer';
        upgradeTowerBtn.on('pointerdown', () => {
            PlayerController.instance.upgradeTower(tower.id, tower.level, tower.cost);
            this.infoTower(tower);
        });
        this.addChild(upgradeTowerBtn);

        let fontCost = tower.cost <= PlayerController.instance.getGold() ? 'GoldPeaberry' : 'RedPeaberry';
        let towerCostTxt = tower.level < 3 ? tower.cost.toString() : 'Max';
        const costUpgradeTxt = this.createText(695, 665, towerCostTxt, 24, fontCost);
        this.addChild(costUpgradeTxt);

        const removeTowerBtn = this.createBtn(700, 750, 'sell_btn');
        removeTowerBtn.interactive = true;
        removeTowerBtn.cursor = 'pointer';
        removeTowerBtn.on('pointerdown', () => {
            PlayerController.instance.sellTower(tower, tower.cost);
            this.towerRange.texture = Texture.EMPTY;
            this.visible = false;
        });
        this.addChild(removeTowerBtn);

        let towerSellTxt = Math.round(tower.cost * 0.8);
        const costSellTxt = this.createText(695, 725, towerSellTxt.toString(), 24, 'GoldPeaberry');
        this.addChild(costSellTxt);
    }

    private createText(x: number, y: number, text: string, fontSize: number, fontFamily: string): BitmapText {
        const textTxt = new BitmapText({
            text: text,
            style: {
                fontFamily: fontFamily,
                fontSize: fontSize,
                align: 'center',
            }
        });

        textTxt.position.set(x, y);
        return textTxt;
    }

    private createBtn(x: number, y: number, texture: string): Sprite {
        const btn = new Sprite(AssetLoad.getTexture(texture));
        btn.position.set(x, y);
        btn.scale.set(0.8);
        btn.anchor.set(0.5);
        return btn;
    }
}