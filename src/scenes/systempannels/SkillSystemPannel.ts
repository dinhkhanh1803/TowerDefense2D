import { AnimatedSprite, Container, Graphics, Sprite, Texture } from "pixi.js";
import { EventHandle } from "../../utils/EventHandle";
import { HeroController } from "../../controllers/HeroController";
import AssetLoad from "../../utils/AssetLoad";
import { EnemyController } from "../../controllers/EnemyController";
import { GameTypes } from "../../types/GameTypes";
import { PauseGame } from "../displays/PauseGame";

export class SkillSystemPannel extends Container {
    public static instance: SkillSystemPannel;
    public isHeroSelected: boolean = false;
    public isSkillSelected: boolean = false;
    private avtHero: Sprite;
    private avtSkill: Sprite;
    private avatarSelected: Sprite;
    private skillSelected: Sprite;
    private cooldownInProgress: boolean = false;

    constructor(idHero?: number) {
        super();
        SkillSystemPannel.instance = this;
        this.avtHero = new Sprite(AssetLoad.getTexture('hero_avatar'));
        this.avtSkill = new Sprite(AssetLoad.getTexture('FireRain_A'));
        this.avatarSelected = new Sprite(AssetLoad.getTexture('avatar_selected'));
        this.skillSelected = new Sprite(AssetLoad.getTexture('avatar_selected'));
        this.avtHero.anchor.set(0.5);

        this.skillSystem();

        if (idHero) {
            this.avatarHero(100, 720, 80, 80);
        }


        // Lắng nghe sự kiện "postion_click" để di chuyển hero
        EventHandle.on(GameTypes.event.movePosition, (x: number, y: number) => {
            this.moveHeroTo(x, y);
            this.resetAvtHero();
        });

        EventHandle.on(GameTypes.event.skillPosition, (x: number, y: number) => {
            this.createDamageZone(x, y);
            this.startCooldown();
            this.resetAvtHero();
        });
    }

    private skillSystem() {
        this.visible = true;
        const bgSprite = new Sprite(Texture.from('UI_board_menu'));
        bgSprite.position.set(0, 640);
        this.addChild(bgSprite);

        this.addSkill(900, 720, 80, 80);
    }

    private avatarHero(x: number, y: number, w: number, h: number) {
        this.avtHero.x = x;
        this.avtHero.y = y - 2;
        this.avtHero.width = w;
        this.avtHero.height = h;
        this.avtHero.interactive = true;
        this.avtHero.cursor = 'pointer';

        this.avatarSelected.x = x;
        this.avatarSelected.y = y;
        this.avatarSelected.anchor.set(0.5);

        this.avtHero.on('pointerup', () => {
            if (!this.isSkillSelected) {
                this.isHeroSelected = true;
                this.isSkillSelected = false;
                this.addChild(this.avatarSelected);
                this.removeChild(this.skillSelected);
            }
        });
        this.addChild(this.avtHero);
    }

    private addSkill(x: number, y: number, w: number, h: number) {
        this.avtSkill.x = x;
        this.avtSkill.y = y;
        this.avtSkill.width = w;
        this.avtSkill.height = h;
        this.avtSkill.anchor.set(0.5);
        this.avtSkill.interactive = true;
        this.avtSkill.cursor = 'pointer';

        this.skillSelected.x = x;
        this.skillSelected.y = y;
        this.skillSelected.anchor.set(0.5);
        this.avtSkill.on('pointerup', () => {
            if (!this.isHeroSelected && !this.cooldownInProgress) {
                this.isSkillSelected = true;
                this.isHeroSelected = false;
                this.addChild(this.skillSelected);
                this.removeChild(this.avatarSelected);
            }
        });
        this.addChild(this.avtSkill);
    }

    public resetAvtHero() {
        this.isHeroSelected = false;
        this.isSkillSelected = false;
        this.removeChild(this.avatarSelected);
        this.removeChild(this.skillSelected);

    }

    private moveHeroTo(x: number, y: number) {
        HeroController.instance.moveToTarget({ x, y });
    }

    createDamageZone(x: number, y: number) {

        const damageZone = new AnimatedSprite(AssetLoad.getAnimation('firerain'));
        damageZone.x = x;
        damageZone.y = y;
        damageZone.width = 150;
        damageZone.height = 150;
        damageZone.anchor.set(0.5);
        damageZone.loop = true;
        damageZone.animationSpeed = 0.1;
        damageZone.play();


        EventHandle.emit(GameTypes.event.addChildToMap, (damageZone));
        EventHandle.emit(GameTypes.event.playSound, 'effect_sound', {
            sprite: 'firerain',
            loop: false,
            volume: .6
        });

        // Hàm kiểm tra kẻ địch trong vùng tròn và gây sát thương
        const damageInterval = setInterval(() => {
            this.checkEnemiesInZone(damageZone);
        }, 800); // Cứ mỗi giây sẽ kiểm tra và gây sát thương cho kẻ địch


        setTimeout(() => {
            clearInterval(damageInterval);
            EventHandle.emit(GameTypes.event.removeChildFromMap, (damageZone));
        }, 5000);

    }

    checkEnemiesInZone(zone: Sprite) {
        if (PauseGame.instance.isPaused) return;
        const enemies = EnemyController.instance.getEnemy();
        enemies.forEach(enemy => {
            if (enemy.isAlive) {
                const distance = Math.sqrt(
                    Math.pow(enemy.sprite.x - zone.x, 2) + Math.pow(enemy.sprite.y - zone.y, 2)
                );
                if (distance <= 100) {
                    enemy.takeDamage(enemy.id, 5);
                }
            }
        });
    }

    startCooldown() {
        if (this.cooldownInProgress) return;

        this.cooldownInProgress = true;
        this.avtSkill.texture = AssetLoad.getTexture('FireRain_U');

        let remainingTime = 10000; // Thời gian hồi chiêu (10 giây)
        const startTime = Date.now();

        const cooldownInterval = setInterval(() => {
            if (PauseGame.instance.isPaused) return; // Không làm gì khi game bị pause

            const elapsedTime = Date.now() - startTime;
            remainingTime = 10000 - elapsedTime;

            if (remainingTime <= 0) {
                clearInterval(cooldownInterval);
                this.cooldownInProgress = false;
                this.avtSkill.texture = AssetLoad.getTexture('FireRain_A');
            }
        }, 100); // Kiểm tra mỗi 100ms
    }

}