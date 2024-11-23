import { BitmapText, Container, Sprite, Texture } from "pixi.js";
import { Game } from "../game";
import AssetLoad from "../utils/AssetLoad";
import { TowerType } from "../types/TowerType";
import { towersData } from "../data/towers";
import { EventHandle } from "../utils/EventHandle";
import { GameTypes } from "../types/GameTypes";

export class TowerPediaScene extends Container {
    private towers: TowerType[];
    private towerpediaBg: Sprite;
    private closeBtn: Sprite;
    private leftArrow: Sprite;
    private rightArrow: Sprite;
    private currentIndex: number = 0;

    private towerImage: Sprite;
    private towerNameText: BitmapText;
    private towerDescriptionText: BitmapText;


    constructor() {
        super();

        this.towers = Object.values(TowerType);

        this.towerpediaBg = this.towerpediaBgSprite();
        this.addChild(this.towerpediaBg);

        this.towerImage = new Sprite(Texture.EMPTY);
        this.towerImage.position.set(350, 350);
        this.towerImage.scale.set(1.5);
        this.towerImage.anchor.set(0.5);
        this.addChild(this.towerImage);

        this.towerNameText = this.nameTowerBitmapText();
        this.addChild(this.towerNameText);

        this.towerDescriptionText = this.descriptionTowerBitmapText();
        this.addChild(this.towerDescriptionText);

        this.leftArrow = this.showPreviousTower();
        this.addChild(this.leftArrow);

        this.rightArrow = this.showNextTower();
        this.addChild(this.rightArrow);

        this.closeBtn = this.backToMapSprite();
        this.addChild(this.closeBtn);

        this.updateTowerInfo();
        this.updateArrowStates();
    }

    private towerpediaBgSprite(): Sprite {
        const backg = new Sprite(Texture.from('bg_towerpedia'));
        return backg;
    }

    private backToMapSprite(): Sprite {
        const closeBtn = new Sprite(Texture.from('btn_close'));
        closeBtn.position.set(900, 50);
        closeBtn.cursor = 'pointer';
        closeBtn.interactive = true;
        closeBtn.on('pointerdown', () => {
            Game.instance.loadMapLevel();
        });
        return closeBtn;
    }

    private showPreviousTower(): Sprite {
        const btn = new Sprite(AssetLoad.getTexture('btn_arrow-left-on'));
        btn.position.set(100, 400);
        btn.anchor.set(0.5);

        btn.interactive = true;
        btn.on('pointerdown', () => {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.updateTowerInfo();
                this.updateArrowStates();
                EventHandle.emit(GameTypes.event.playSound, 'effect_sound', {
                    sprite: 'button',
                    loop: false,
                    volume: 0.8
                });
            }
        });
        return btn;
    }

    private showNextTower(): Sprite {
        const btn = new Sprite(AssetLoad.getTexture('btn_arrow-right-on'));
        btn.position.set(924, 400);
        btn.anchor.set(0.5);

        btn.interactive = true;
        btn.on('pointerdown', () => {
            if (this.currentIndex < this.towers.length - 1) {
                this.currentIndex++;
                this.updateTowerInfo();
                this.updateArrowStates();
                EventHandle.emit(GameTypes.event.playSound, 'effect_sound', {
                    sprite: 'button',
                    loop: false,
                    volume: 0.8
                });
            }
        });
        return btn;
    }

    private updateTowerInfo() {
        let tower = this.towers[this.currentIndex];

        const towerData = towersData.find(t => t.name === tower);

        if (towerData) {
            this.towerImage.texture = AssetLoad.getTexture(`${towerData.name}_01`);
            this.towerNameText.text = towerData.name;
            this.towerDescriptionText.text = `
            Range Attack: ${towerData.range}\n
            \n
            Damage: ${towerData.damage}\n
            \n
            Fire Rate: ${towerData.fireRate}
            `;
        } else {
            console.log("Tower data not found");
        }
    }

    private nameTowerBitmapText(): BitmapText {
        const style = {
            fontFamily: 'ShinyPeaberry',
            fontSize: 24,
            fill: '#ffffff',
        }
        const text = new BitmapText({
            text: '',
            style: style
        });
        text.position.set(350, 430);
        text.anchor.set(0.5);
        return text;
    }

    private descriptionTowerBitmapText(): BitmapText {
        const style = {
            fontFamily: '',
            fontSize: 24,
            fill: '#000000',
        }
        const text = new BitmapText({
            text: '',
            style: style
        });
        text.position.set(550, 400);
        text.anchor.set(0.5);
        return text;
    }

    private updateArrowStates() {
        // Cập nhật trạng thái nút trái
        if (this.currentIndex > 0) {
            this.leftArrow.texture = AssetLoad.getTexture('btn_arrow-left-on');
        } else {
            this.leftArrow.texture = AssetLoad.getTexture('btn_arrow-left-off');
        }

        // Cập nhật trạng thái nút phải
        if (this.currentIndex < this.towers.length - 1) {
            this.rightArrow.texture = AssetLoad.getTexture('btn_arrow-right-on');
        } else {
            this.rightArrow.texture = AssetLoad.getTexture('btn_arrow-right-off');
        }
    }

}