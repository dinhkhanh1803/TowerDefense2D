import { BitmapText, Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { PlayerController } from '../../controllers/PlayerController';
import AssetLoad from "../../utils/AssetLoad";

export class HUD extends Container {
    public static instance: HUD;
    private healthBar: Sprite;
    private moneyBar: Sprite;
    private waveBar: Sprite;
    private healthText: BitmapText;
    private moneyText: BitmapText;
    private waveText: BitmapText;

    constructor() {
        super();
        HUD.instance = this;

        // Khởi tạo các thanh bar
        this.healthBar = this.createBar(60, 30, 'health_bar');
        this.moneyBar = this.createBar(180, 30, 'build_bar');
        this.waveBar = this.createBar(300, 30, 'wave_bar');

        // Khởi tạo các Text hiển thị thông số
        this.healthText = this.createText(this.healthBar.position.x + 10, this.healthBar.position.y);
        this.moneyText = this.createText(this.moneyBar.position.x + 10, this.moneyBar.position.y);
        this.waveText = this.createText(this.waveBar.position.x + 10, this.waveBar.position.y);

        // Thêm các thanh bar và Text vào HUD
        this.addChild(this.healthBar);
        this.addChild(this.moneyBar);
        this.addChild(this.waveBar);
        this.addChild(this.healthText);
        this.addChild(this.moneyText);
        this.addChild(this.waveText);

        // Cập nhật HUD ban đầu
        this.updateHUD();
    }

    updateHUD() {
        const health = PlayerController.instance.getHealth();
        const money = PlayerController.instance.getGold();
        const wave = PlayerController.instance.getWaves();
        const currentWave = PlayerController.instance.getCurrentWave();

        // Cập nhật nội dung của các Text dựa trên các thông số
        this.healthText.text = ` ${health}`;
        this.moneyText.text = ` ${money}`;
        this.waveText.text = ` ${currentWave}/${wave}`;
    }

    private createBar(x: number, y: number, texture: string): Sprite {
        const bar = new Sprite(AssetLoad.getTexture(texture));
        bar.anchor.set(0.5);
        bar.scale.set(0.6);
        bar.position.set(x, y);
        return bar;
    }

    private createText(x: number, y: number): BitmapText {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#ffffff',
            align: 'center'
        });
        const text = new BitmapText('', style);
        text.anchor.set(0.5);
        text.position.set(x, y);
        return text;
    }
}