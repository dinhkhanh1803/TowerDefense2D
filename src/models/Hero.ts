import { Sprite, Texture } from 'pixi.js';
import { Skill } from "./Skill";
import { Enemy } from './Enemy';
import AssetLoad from '../utils/AssetLoad';
import { BfsPathfinding } from '../utils/BfsPathfinding';

export class Hero {
    id: number;            // ID của hero
    name: string;          // Tên của hero
    sprite: Sprite;
    speed: number;
    attackRadius: number
    hp: number;            // Số lượng máu hiện tại
    maxHp: number;         // Số lượng máu tối đa
    mp: number;            // Số lượng năng lượng hiện tại
    maxMp: number;         // Số lượng năng lượng tối đa
    attackPower: number;   // Sức mạnh tấn công cơ bản
    defense: number;       // Chỉ số phòng thủ
    skills: Skill[];       // Danh sách các kỹ năng mà hero có thể sử dụng
    target: Enemy[] = [];
    isDead: boolean = false;
    currentPosition!: { x: number, y: number };
    goalPosition!: { x: number, y: number };
    pathfinding!: BfsPathfinding;
    currentPathIndex: number = 0;
    isMoving: boolean = false;

    constructor(id: number, name: string, speed: number, attackRadius: number, maxHp: number, maxMp: number, attackPower: number, defense: number) {
        this.id = id;
        this.name = name;
        this.sprite = new Sprite(Texture.from('enemy3'));
        this.sprite.anchor.set(0.5);
        this.speed = speed;
        this.attackRadius = attackRadius;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.maxMp = maxMp;
        this.mp = maxMp;
        this.attackPower = attackPower;
        this.defense = defense;
        this.skills = [];
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
        this.pathfinding = new BfsPathfinding(gridMap);
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

        if (path && this.currentPathIndex >= path.length) {
            this.isMoving = false;
        }
    }

    // Hồi máu cho hero
    heal(amount: number): void {
        this.hp += amount;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
        console.log(`${this.name} đã được hồi ${amount} máu.`);
    }

    // Nhận sát thương
    takeDamage(amount: number): void {
        const damage = Math.max(amount - this.defense, 0); // Trừ phòng thủ ra khỏi sát thương nhận được
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
        }
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
