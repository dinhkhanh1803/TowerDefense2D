interface TowerConfig {
    name: string;
    damage: number;
    range: number;
    fireRate: number;
    cost: number;
    projectileType: string;
}

// Tower data without creating actual Tower objects
export const towersData: TowerConfig[] = [
    {
        name: "Archer",
        damage: 5,
        range: 130,
        fireRate: 60,
        cost: 70,
        projectileType: "arrow"
    },
    {
        name: "Mage",
        damage: 7,
        range: 120,
        fireRate: 60,
        cost: 110,
        projectileType: "magicball"
    },
    {
        name: "Fire",
        damage: 8,
        range: 180,
        fireRate: 80,
        cost: 150,
        projectileType: "fireball"
    },
    {
        name: "Ice",
        damage: 6,
        range: 120,
        fireRate: 90,
        cost: 130,
        projectileType: "iceshard"
    },
    {
        name: "Cannon",
        damage: 7,
        range: 170,
        fireRate: 120,
        cost: 120,
        projectileType: "cannonball"
    },
    {
        name: "Tesla",
        damage: 9,
        range: 160,
        fireRate: 100,
        cost: 250,
        projectileType: "lightning"
    }
];