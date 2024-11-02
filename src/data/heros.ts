// Define data structure for hero configuration
interface HeroConfig {
    id: number;
    name: string;
    speed: number;
    attackRange: number;
    maxHealth: number;
    maxMana: number;
    attackPower: number;
    defense: number;
}

// Hero data without creating actual Hero objects
export const herosData: HeroConfig[] = [
    {
        id: 1,
        name: "Warrior",
        speed: 1.2,
        attackRange: 100,
        maxHealth: 100,
        maxMana: 50,
        attackPower: 20,
        defense: 5
    },
    {
        id: 2,
        name: "Mage",
        speed: 1.0,
        attackRange: 150,
        maxHealth: 80,
        maxMana: 100,
        attackPower: 30,
        defense: 2
    },
    {
        id: 3,
        name: "Archer",
        speed: 1.5,
        attackRange: 120,
        maxHealth: 70,
        maxMana: 40,
        attackPower: 15,
        defense: 3
    },
    {
        id: 4,
        name: "Paladin",
        speed: 1.1,
        attackRange: 80,
        maxHealth: 150,
        maxMana: 60,
        attackPower: 25,
        defense: 8
    },
    {
        id: 5,
        name: "Assassin",
        speed: 1.8,
        attackRange: 90,
        maxHealth: 60,
        maxMana: 30,
        attackPower: 35,
        defense: 1
    }
];