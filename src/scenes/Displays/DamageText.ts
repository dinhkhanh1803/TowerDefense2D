import { Text, Container } from 'pixi.js';
import { EventHandle } from '../../utils/EventHandle';
import { GameTypes } from '../../types/GameTypes';

export class DamageText {
    private text: Text;
    private lifetime: number;
    private fadeSpeed: number;

    constructor(damage: number, x: number, y: number) {
        this.text = new Text("- " + damage.toString(), {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xff0000, // Màu đỏ cho damage text
            align: 'center',
            stroke: 0x000000,
        });


        this.text.x = x;
        this.text.y = y - 15;
        this.lifetime = 30; // Thời gian tồn tại của text
        this.fadeSpeed = 0.01;
    }

    // Hàm update để di chuyển và làm mờ text dần dần
    update(deltaTime: number): boolean {
        this.text.y -= 1 * deltaTime; // Di chuyển lên trên
        this.text.alpha -= this.fadeSpeed * deltaTime; // Làm mờ dần
        this.lifetime -= deltaTime;

        return this.lifetime <= 0; // Trả về true nếu text đã hết thời gian hiển thị
    }

    // Thêm text vào Container
    addTo() {
        EventHandle.emit(GameTypes.event.addChildToMap, (this.text));
        //container.addChild(this.text);
    }

    // Xóa text khỏi Container
    removeFrom() {
        EventHandle.emit(GameTypes.event.removeChildFromMap, (this.text));
        //container.removeChild(this.text);
    }
}
