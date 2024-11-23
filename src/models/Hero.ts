import { AnimatedSprite, PointData, Sprite, Texture } from 'pixi.js';
import { Skill } from "./Skill";
import { Enemy } from './Enemy';
import { bfsPathfinding } from '../utils/BfsPathfinding';
import { Character } from './Character';
import AssetLoad from '../utils/AssetLoad';

export class Hero extends Character {
    public attackRadius: number;
    private attackRadiusSprite: Sprite;
    private mp: number;
    private maxMp: number;
    private defense: number;
    private skills: Skill[];

    public isMoving: boolean = false;

    public attackDownTextures!: Texture[];
    public attackLeftTextures!: Texture[];
    public attackRightTextures!: Texture[];
    public attackUpTextures!: Texture[];

    constructor(id: number, name: string, speed: number, attackRadius: number, maxHp: number, maxMp: number, attackPower: number, defense: number) {
        super(id, name, maxHp, speed, attackPower);
        this.attackRadius = attackRadius;
        this.maxMp = maxMp;
        this.mp = maxMp;
        this.defense = defense;
        this.skills = [];

        this.attackRadiusSprite = new Sprite(AssetLoad.getTexture('range_tower'));
        this.attackRadiusSprite.anchor.set(0.5, 0.5);
        this.attackRadiusSprite.scale.set(attackRadius / 100);
        this.attackRadiusSprite.position = this.spriteAni.position;
        this.spriteAni.addChild(this.attackRadiusSprite);
        this.sprite.zIndex = 100;
    }

    public spawnPosition(postion: { x: number, y: number }) {
        this.sprite.x = postion.x * 64 + 32;
        this.sprite.y = postion.y * 64 + 32;
        this.currentPosition = postion;
    }

    public setPosition(currentPosition: { x: number, y: number }, targetPosition: { x: number, y: number }, gridMap: number[][]) {

        this.currentPosition = { x: currentPosition.x, y: currentPosition.y };
        this.goalPosition = { x: targetPosition.x, y: targetPosition.y };

        this.pathfinding = new bfsPathfinding(gridMap);
        const path = this.pathfinding.bfs(this.currentPosition, this.goalPosition);

        if (path) {
            this.isMoving = true;
            this.currentPathIndex = 0;
        } else {
            this.isMoving = false;
        }
    }

    public update(deltaTime: number) {
        if (!this.isMoving || !this.goalPosition) return;

        const path = this.pathfinding.bfs(this.currentPosition, this.goalPosition);
        if (path && this.currentPathIndex < path.length) {
            this.moveAlongPath(path, deltaTime);
        } else {
            this.isMoving = false;
        }
    }

    private moveAlongPath(path: { x: number, y: number }[], deltaTime: number) {
        const target = path[this.currentPathIndex];
        const tileCenterX = (target.x * 64) + (64 / 2);
        const tileCenterY = (target.y * 64) + (64 / 2);
        const dx = tileCenterX - this.sprite.x;
        const dy = tileCenterY - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            this.sprite.x += (dx / dist) * this.speed * deltaTime;
            this.sprite.y += (dy / dist) * this.speed * deltaTime;
            this.updateAnimation(dx, dy);
        } else {
            // Đạt đến mục tiêu hiện tại, chuyển sang điểm tiếp theo
            this.currentPathIndex++;

            // Dừng animation khi đến đích
            if (this.currentPathIndex >= path.length) {
                this.isMoving = false;
                this.spriteAni.gotoAndStop(0);
            }
        }
    }

    private heal(amount: number): void {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    private takeDamage(amount: number): void {
        const damage = Math.max(amount - this.defense, 0);
        super.receiveDamage(damage);
        console.log(`${this.name} nhận ${damage} sát thương, còn ${this.hp} HP.`);
    }


    private useSkill(skillId: string): void {
        const skill = this.skills.find(s => s.id === skillId);
        if (skill && skill.isReady()) {
            if (this.mp >= skill.manaCost) {
                this.mp -= skill.manaCost;
                skill.use();
            } else {
                console.log(`${this.name} không đủ mana để sử dụng kỹ năng ${skill.name}`);
            }
        } else {
            console.log(`${this.name} không thể sử dụng kỹ năng đó ngay bây giờ`);
        }
    }

    private addSkill(skill: Skill): void {
        this.skills.push(skill);
    }

    private updateAnimation(dx: number, dy: number) {
        let newTexture = this.getTextureBasedOnDirection(dx, dy);
        if (this.spriteAni.textures !== newTexture) {
            this.spriteAni.textures = newTexture;
            this.spriteAni.animationSpeed = 0.09;
            this.spriteAni.play();
        }
    }

    private getTextureBasedOnDirection(dx: number, dy: number): Texture[] {
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? this.moveRightTextures : this.moveLeftTextures;
        }
        return dy > 0 ? this.moveDownTextures : this.moveUpTextures;
    }


    public attack(enemy: Enemy) {
        let attackTextures;

        if (this.spriteAni.textures === this.moveDownTextures) {
            attackTextures = this.attackDownTextures;
        } else if (this.spriteAni.textures === this.moveLeftTextures) {
            attackTextures = this.attackLeftTextures;
        } else if (this.spriteAni.textures === this.moveRightTextures) {
            attackTextures = this.attackRightTextures;
        } else if (this.spriteAni.textures === this.moveUpTextures) {
            attackTextures = this.attackUpTextures;
        }

        if (attackTextures) {
            this.spriteAni.textures = attackTextures;
        }

        if (this.checkInRange(enemy.getUpdatePositionEnemy()) && !this.spriteAni.playing) {
            this.spriteAni.play();

            this.spriteAni.onFrameChange = (currentFrame: number) => {
                if (currentFrame === this.spriteAni.totalFrames - 1) {
                    enemy.takeDamage(enemy.id, this.damage);

                    this.spriteAni.gotoAndStop(0);
                }
            };
        }
    }

    public checkInRange(enemiesPos: PointData): boolean {
        const distance = Math.sqrt(Math.pow(enemiesPos.x - this.sprite.x + 32, 2) + Math.pow(enemiesPos.y - this.sprite.y + 32, 2));
        return distance <= this.attackRadius;
    }
}
