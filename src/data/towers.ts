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
        range: 100,
        fireRate: 60,
        cost: 80,
        projectileType: "arrow"
    },
    {
        name: "Mage",
        damage: 5,
        range: 100,
        fireRate: 60,
        cost: 100,
        projectileType: "magicball"
    },
    {
        name: "Fire",
        damage: 5,
        range: 120,
        fireRate: 80,
        cost: 150,
        projectileType: "fireball"
    },
    {
        name: "Ice",
        damage: 5,
        range: 150,
        fireRate: 90,
        cost: 200,
        projectileType: "iceshard"
    },
    {
        name: "Cannon",
        damage: 7,
        range: 170,
        fireRate: 120,
        cost: 200,
        projectileType: "cannonball"
    },
    {
        name: "Tesla",
        damage: 6,
        range: 180,
        fireRate: 100,
        cost: 250,
        projectileType: "lightning"
    }
];