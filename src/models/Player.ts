import { EventHandle } from "../utils/EventHandle";
import { Hero } from "./Hero";

export class Player {
    level: number;
    experience: number;
    heroes: Hero[];
    coin: number;
    health: number;
    maxHealth: number;
    wave: number;


    constructor(coin: number, health: number, wave: number) {
        this.level = 1;
        this.experience = 0;
        this.heroes = [];
        this.coin = coin;
        this.health = health;
        this.maxHealth = health;
        this.wave = wave;
    }

    // Thêm hero vào danh sách của người chơi
    addHero(hero: Hero): void {
        this.heroes.push(hero);
    }

    // Tăng điểm kinh nghiệm và lên cấp khi đạt đủ điều kiện
    // gainExperience(exp: number): void {
    //     this.experience += exp;
    //     if (this.experience >= this.level * 100) { // Ví dụ: cần 100 kinh nghiệm để lên mỗi cấp
    //         this.levelUp();
    //     }
    // }

    // Tăng cấp độ cho người chơi
    private levelUp(): void {
        this.level += 1;
        this.experience = 0;
        // console.log(`${this.name} đã lên cấp ${this.level}!`);
    }

    // Kiểm tra tài nguyên của người chơi
    hasEnoughResources(amount: number): boolean {
        return this.coin >= amount;
    }

    // Them tai nguyen
    addResources(amount: number) {
        this.coin += amount;
    }

    // Tiêu thụ tài nguyên
    consumeResources(amount: number): boolean {
        if (this.hasEnoughResources(amount)) {
            this.coin -= amount;
            return true;
        }
        return false;
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
        }
    }
}
