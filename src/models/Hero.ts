import { Sprite, Texture } from 'pixi.js';
import { Skill } from "./Skill";
import { Enemy } from './Enemy';
import { bfsPathfinding } from '../utils/BfsPathfinding';
import { Character } from './Character';

export class Hero extends Character {
    private attackRadius: number
    private mp: number;
    private maxMp: number;
    private defense: number;
    private skills: Skill[];
    private target: Enemy[] = [];
    private isMoving: boolean = false;

    constructor(id: number, name: string, speed: number, attackRadius: number, maxHp: number, maxMp: number, attackPower: number, defense: number) {
        super(id, name, maxHp, speed, attackPower);
        this.attackRadius = attackRadius;
        this.maxMp = maxMp;
        this.mp = maxMp;
        this.defense = defense;
        this.skills = [];


        this.sprite.zIndex = 100;

    }

    spawnPosition(postion: { x: number, y: number }) {
        this.sprite.x = postion.x * 64 + 32;
        this.sprite.y = postion.y * 64 + 32;
        this.currentPosition = postion;
    }

    setPosition(currentPosition: { x: number, y: number }, targetPosition: { x: number, y: number }, gridMap: number[][]) {

        this.currentPosition = { x: currentPosition.x, y: currentPosition.y };
        this.goalPosition = { x: targetPosition.x, y: targetPosition.y };
        console.log(this.currentPosition, this.goalPosition);
        this.pathfinding = new bfsPathfinding(gridMap);
        const path = this.pathfinding.bfs(this.currentPosition, this.goalPosition);
        console.log(path);
        if (path) {
            this.isMoving = true;
            this.currentPathIndex = 0;
        } else {
            this.isMoving = false;
        }
    }

    update(deltaTime: number) {
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
        const dx = target.x * 64 - this.sprite.x;
        const dy = target.y * 64 - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            this.sprite.x += (dx / dist) * this.speed * deltaTime;
            this.sprite.y += (dy / dist) * this.speed * deltaTime;
        } else {
            this.currentPathIndex++;
        }
    }

    // Hồi máu cho hero
    heal(amount: number): void {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    // Nhận sát thương
    takeDamage(amount: number): void {
        const damage = Math.max(amount - this.defense, 0); // Trừ phòng thủ ra khỏi sát thương nhận được
        super.receiveDamage(damage);
        console.log(`${this.name} nhận ${damage} sát thương, còn ${this.hp} HP.`);
    }

    // Sử dụng kỹ năng
    useSkill(skillId: string): void {
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

    // Thêm kỹ năng vào hero
    addSkill(skill: Skill): void {
        this.skills.push(skill);
    }
}
