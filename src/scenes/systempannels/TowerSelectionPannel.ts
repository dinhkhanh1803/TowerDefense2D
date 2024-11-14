import { LevelTypes } from '../../types/LevelTypes';
import { towersData } from '../../data/towers';
import { BitmapText, Container, Graphics, Sprite, Texture } from "pixi.js";
import { TowerType } from "../../types/TowerType";
import AssetLoad from "../../utils/AssetLoad";
import { PlayerController } from "../../controllers/PlayerController";
import { TowerInfoPannel } from "./TowerInfoPannel";
import { levels } from '../../data/levels';

export class TowerSelectionPannel extends Container {
    public static instance: TowerSelectionPannel;
    public slotTower!: Sprite;
    private typeTower: TowerType[];

    constructor(dataTower: TowerType[]) {
        super();
        TowerSelectionPannel.instance = this;
        this.visible = false;

        this.typeTower = dataTower;
    }

    menuTower() {
        TowerInfoPannel.instance.visible = false;
        this.visible = true;

        const uiBoard = new Sprite(Texture.from('UI_board_menu'));
        uiBoard.position.set(0, 640);
        this.addChild(uiBoard);




        const startX = 50;
        const startY = 650;
        const cardSpacing = 20;

        for (let i = 0; i < this.typeTower.length; i++) {
            const type = this.typeTower[i];
            const cardX = startX + i * (100 + cardSpacing);
            const cardY = startY;
            const card = this.createCardTower(type, cardX, cardY);
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

        const nameTowerTxt = this.createText(type, x + 50, y + 80);
        const priceTowerTxt = this.priceTowerTxt(type, x + 50, y + 100);


        card.interactive = true;
        card.cursor = 'pointer';
        card.on('pointerdown', () => {
            PlayerController.instance.buyTower(type, this.slotTower);
            this.visible = false;
        });
        card.addChild(cardTower);
        card.addChild(spriteTower);
        card.addChild(nameTowerTxt);
        card.addChild(priceTowerTxt);

        return card;
    }

    createText(text: string, x: number, y: number): BitmapText {
        const bitmapTxt = new BitmapText({
            text: text,
            style: {
                fontFamily: '',
                fontSize: 11,
                align: 'center'
            },
        });
        bitmapTxt.anchor.set(0.5, 0.5);
        bitmapTxt.position.set(x, y);

        this.addChild(bitmapTxt);
        return bitmapTxt;
    }

    priceTowerTxt(type: string, x: number, y: number): Container {
        const tower = towersData.find(tower => type === tower.name);

        // Lấy số tiền của người chơi
        const playerGold = PlayerController.instance.getGold();

        const priceContainer = new Container();

        // Kiểm tra nếu số tiền của người chơi nhỏ hơn giá tower
        const fontColor = playerGold < (tower ?.cost || 0) ? 'RedPeaberry' : 'ShinyPeaberry';

        // Tạo text cho giá tiền với font color theo điều kiện
        const bitmapTxt = new BitmapText({
            text: tower ? tower.cost.toString() : '0',
            style: {
                fontFamily: fontColor,
                fontSize: 13,
                align: 'center'
            },
        });
        bitmapTxt.anchor.set(0.5, 0.5);
        bitmapTxt.position.set(0, 0); // Đặt tại vị trí trung tâm của container

        // Tạo hình đồng xu
        const coin = new Sprite(AssetLoad.getTexture('coin'));
        coin.anchor.set(0.5, 0.4);
        coin.scale.set(0.7);
        coin.position.set(bitmapTxt.width / 2 + 10, 0); // Đặt hình đồng xu bên phải của text

        // Thêm cả text và đồng xu vào container
        priceContainer.addChild(bitmapTxt);
        priceContainer.addChild(coin);

        // Đặt container vào vị trí mong muốn
        priceContainer.position.set(x, y);

        this.addChild(priceContainer);
        return priceContainer;
    }
}