import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { EventHandle } from "../utils/EventHandle";
import { HeroController } from "../controllers/HeroController";

export class SkillSystemPannel extends Container {
    public static instance: SkillSystemPannel;
    isHeroSelected: boolean = false;
    avtHero: Sprite;

    constructor() {
        super();
        SkillSystemPannel.instance = this;
        this.avtHero = new Sprite(Texture.from('Archer_02'));
        this.avtHero.anchor.set(0.5);


        this.SkillSystem();

        // Lắng nghe sự kiện "postion_click" để di chuyển hero
        EventHandle.on('postion_click', (x: number, y: number) => {
            this.moveHeroTo(x, y);
            this.resetAvtHero(); // Reset sau khi hero đã được di chuyển
        });
    }

    SkillSystem() {
        this.visible = true;
        const grapbg = new Graphics();
        grapbg.rect(0, 640, 1024, 160);
        grapbg.fill(0xFEF9F2);
        this.addChild(grapbg);

        this.avatarHero();
    }

    avatarHero() {
        this.avtHero.x = 50;
        this.avtHero.y = 700;
        this.avtHero.width = 80;
        this.avtHero.height = 80;

        this.avtHero.interactive = true;
        this.avtHero.cursor = 'pointer';

        this.avtHero.on('pointerdown', () => {
            this.isHeroSelected = true;
            this.avtHero.scale.set(1.5);
        });
        this.addChild(this.avtHero);
    }

    resetAvtHero() {
        this.isHeroSelected = false;
        this.avtHero.scale.set(1);
    }

    moveHeroTo(x: number, y: number) {
        HeroController.instance.moveToTarget({ x, y });
    }
}