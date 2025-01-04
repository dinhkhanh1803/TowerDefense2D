import { Container, Graphics, Sprite, Texture, Text, BitmapText, TextStyle } from "pixi.js";
import { Tower } from "../../models/Tower";
import { PlayerController } from "../../controllers/PlayerController";
import { TowerSelectionPannel } from "./TowerSelectionPannel";
import AssetLoad from "../../utils/AssetLoad";
import { EventHandle } from "../../utils/EventHandle";
import { GameTypes } from "../../types/GameTypes";
import { gsap } from "gsap";

export class TowerInfoPannel extends Container {
    public static instance: TowerInfoPannel;
    private towerRange: Sprite;
    private uiBoard!: Sprite;
    public isShowPanel: boolean = false;
    private imageTower!: Sprite;
    private nameTower!: BitmapText;
    private towerDescription!: BitmapText;

    constructor() {
        super();
        TowerInfoPannel.instance = this;
        this.towerRange = new Sprite();
        this.visible = false;

        this.uiBoard = new Sprite(Texture.from('UI_board_info'));
        this.uiBoard.position.set(0, GameTypes.GAME_HEIGHT);
        this.addChild(this.uiBoard);

        this.imageTower = new Sprite(Texture.EMPTY);
        this.imageTower.scale.set(2);
        this.imageTower.anchor.set(0.5);
        this.imageTower.position.set(150, 710);
        this.addChild(this.imageTower);

        this.nameTower = this.createText(220, 650, ``, 32, 'ShinyPeaberry');
        this.addChild(this.nameTower);

        this.towerDescription = this.createTextDes(180, 700, ``, 22, '');
        this.addChild(this.towerDescription);
    }

    public inforTower(tower: Tower) {
        this.towerRange.texture = AssetLoad.getTexture('range_tower');
        this.towerRange.anchor.set(0.5);
        this.towerRange.position.set(tower.sprite.x + 32, tower.sprite.y + 32);
        this.towerRange.width = tower.range * 2;
        this.towerRange.height = tower.range * 2;
        this.addChild(this.towerRange);

        this.imageTower.texture = AssetLoad.getTexture(`${tower.name}_0${tower.level}`);

        this.nameTower.text = tower.name;

        this.towerDescription.text = `
        Range Attack: ${tower.range}\n

        Damage: ${tower.damage}\n

        Fire Rate: ${tower.fireRate}
        `;


        const upgradeTowerBtn = this.createBtn(700, 690, 'upgrade_btn');
        upgradeTowerBtn.interactive = true;
        upgradeTowerBtn.cursor = 'pointer';
        upgradeTowerBtn.on('pointerup', () => {
            PlayerController.instance.upgradeTower(tower.id, tower.level, tower.cost);
            this.showPanel(tower);
            EventHandle.emit(GameTypes.event.playSound, 'effect_sound', {
                sprite: 'upgrade',
                loop: false,
                volume: 0.8
            });
        });
        this.addChild(upgradeTowerBtn);

        let fontCost = tower.cost <= PlayerController.instance.getGold() ? 'GoldPeaberry' : 'RedPeaberry';
        let towerCostTxt = tower.level < 3 ? tower.cost.toString() : 'Max';
        const costUpgradeTxt = this.createText(695, 665, towerCostTxt, 24, fontCost);
        this.addChild(costUpgradeTxt);

        const removeTowerBtn = this.createBtn(700, 750, 'sell_btn');
        removeTowerBtn.interactive = true;
        removeTowerBtn.cursor = 'pointer';
        removeTowerBtn.on('pointerup', () => {
            PlayerController.instance.sellTower(tower, tower.cost);
            this.towerRange.texture = Texture.EMPTY;
            this.visible = false;
        });
        this.addChild(removeTowerBtn);

        let towerSellTxt = Math.round(tower.cost * 0.8);
        const costSellTxt = this.createText(695, 725, towerSellTxt.toString(), 24, 'GoldPeaberry');
        this.addChild(costSellTxt);
    }

    public showPanel(tower: Tower) {
        if (this.isShowPanel) return;
        this.isShowPanel = true;
        TowerSelectionPannel.instance.hidePanel();
        this.visible = true;
        this.inforTower(tower);

        gsap.to(this.uiBoard.position, {
            y: 630, // Đưa UI lên cao hơn một chút để nhún
            duration: 0.2, // Thời gian nhún ban đầu
            ease: "power2.out", // Hiệu ứng easing
            onComplete: () => {
                gsap.to(this.uiBoard.position, {
                    y: 640, // Đưa về vị trí cuối cùng
                    duration: 0.1, // Thời gian đưa về vị trí
                    ease: "bounce.out", // Hiệu ứng nhún tự nhiên
                    onComplete: () => {

                    }
                });
            }
        });
    }

    public hidePanel() {
        this.isShowPanel = false;
        this.visible = false;
        gsap.to(this.uiBoard.position, {
            y: GameTypes.GAME_HEIGHT, // Di chuyển xu
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {

            }
        });
    }

    private createText(x: number, y: number, text: string, fontSize: number, fontFamily: string): BitmapText {
        const textTxt = new BitmapText({
            text: text,
            style: {
                fontFamily: fontFamily,
                fontSize: fontSize,
                align: 'left',
            }
        });

        textTxt.position.set(x, y);
        return textTxt;
    }

    private createTextDes(x: number, y: number, text: string, fontSize: number, fontFamily: string): BitmapText {
        const textTxt = new BitmapText({
            text: text,
            style: {
                fontFamily: fontFamily,
                fontSize: fontSize,
                align: 'left',
                fill: '#3D3D3D',
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