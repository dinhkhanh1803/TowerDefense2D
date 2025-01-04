import { Container, Text, Graphics, Sprite } from 'pixi.js';
import { EventHandle } from '../../utils/EventHandle';
import { Game } from '../../game';
import AssetLoad from '../../utils/AssetLoad';
import { GameTypes } from '../../types/GameTypes';

export class ResultPannel extends Container {
    private showPanel: Container;
    private levelId: number;

    constructor(isWin: boolean, healthPercentage: number, level: number) {
        super();
        this.levelId = level;

        this.showPanel = new Container();

        // Tạo background cho bảng kết quả
        const texture = isWin ? 'vitory_ui' : 'lost_ui';
        const virorySprite = this.createResultPanel(650, 430, texture);
        this.showPanel.addChild(virorySprite);

        // Tạo button
        const restartBtn = this.createButton(200, 80, 350, 450, 'restart-btn');
        restartBtn.on('pointerup', this.onRetry);
        const closeBtn = this.createButton(200, 80, 650, 450, 'maplevel-btn');
        closeBtn.on('pointerup', this.onExit);

        //Tạo star
        const starDis = this.starDisplay(400, 110, healthPercentage);
        this.showPanel.addChild(starDis);


        this.showPanel.addChild(restartBtn);
        this.showPanel.addChild(closeBtn);

        this.showPanel.position.set(this.width / 2, this.height / 2);
        this.addChild(this.showPanel);

        //tạo sound

        if (isWin) {
            EventHandle.emit(GameTypes.event.playSound, 'game_sound', {
                sprite: 'win',
                loop: false,
                volume: 0.8
            });
        } else {
            EventHandle.emit(GameTypes.event.playSound, 'game_sound', {
                sprite: 'gamelose',
                loop: false,
                volume: 0.8
            });
        }
    }

    private starDisplay(x: number, y: number, healthPercentage: number): Container {
        const starContainer = new Container();
        const star1 = new Sprite(AssetLoad.getTexture('star_1'));
        star1.position.set(x - 5, y);
        const star2 = new Sprite(AssetLoad.getTexture('star_2'));
        star2.position.set(x + 145, y);
        const star3 = new Sprite(AssetLoad.getTexture('star_3'));
        star3.position.set(x + 65, y);


        // Hiển thị số sao dựa trên phần trăm máu còn lại
        if (healthPercentage >= 99) {
            starContainer.addChild(star1, star2, star3); // 3 sao
        } else if (healthPercentage < 99 && healthPercentage > 33) {
            starContainer.addChild(star1, star3); // 2 sao
        } else if (healthPercentage > 0 && healthPercentage <= 33) {
            starContainer.addChild(star1); // 1 sao
        }

        return starContainer;
    }

    private onRetry = () => {
        Game.instance.reloadGameScene(this.levelId);
    };

    private onExit = () => {
        Game.instance.loadMapLevel();
    };

    private createResultPanel(w: number, h: number, texture: string): Sprite {
        const bgSprite = new Sprite(AssetLoad.getTexture(texture));
        bgSprite.x = GameTypes.MAP_WIDTH / 2;
        bgSprite.y = GameTypes.MAP_HEIGHT / 2;
        bgSprite.width = w;
        bgSprite.height = h;
        bgSprite.anchor.set(0.5);
        return bgSprite;
    }

    private createButton(w: number, h: number, x: number, y: number, texture: string): Sprite {
        const button = new Sprite(AssetLoad.getTexture(texture));
        button.x = x;
        button.y = y;
        button.width = w;
        button.height = h;
        button.anchor.set(0.5);
        button.interactive = true;
        button.eventMode = 'static';
        button.cursor = 'pointer';
        return button;
    }
}
