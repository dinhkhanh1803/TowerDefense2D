
// Define data structure for enemy configuration
interface EnemyConfig {
    name: string;
    hp: number;
    speed: number;
    damage: number;
    reward: number;
}

// Enemy data without creating actual Enemy objects
export const enemiesData: EnemyConfig[] = [
    {
        name: "Grunt",
        hp: 20,
        speed: 1,
        damage: 1,
        reward: 5
    },
    {
        name: "Monster",
        hp: 30,
        speed: 1.5,
        damage: 1,
        reward: 10
    },
    {
        name: "Giant",
        hp: 50,
        speed: 1.0,
        damage: 2,
        reward: 15
    },
    {
        name: "Speedster",
        hp: 50,
        speed: 0.8,
        damage: 2,
        reward: 20
    },
    {
        name: "Boss",
        hp: 50,
        speed: 0.8,
        damage: 2,
        reward: 30
    }
];
