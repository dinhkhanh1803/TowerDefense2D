import { Tower } from "../models/Tower";

export const towersData: Tower[] = [
    new Tower(
        1,
        "Archer",
        2, // Damage
        100, // Range
        60, // Fire rate (seconds per shot)
        80, // Cost
        "arrow" // Projectile type
    ),
    new Tower(
        2,
        "Mage",
        3, // Damage
        100, // Range
        60, // Fire rate
        100, // Cost
        "magicball" // Projectile type
    ),
    new Tower(
        3,
        "Fire",
        5, // Damage
        120, // Range
        80, // Fire rate
        150, // Cost
        "fireball" // Projectile type
    ),
    new Tower(
        4,
        "Ice",
        4, // Damage
        150, // Range
        90, // Fire rate
        200, // Cost
        "iceshard" // Projectile type
    ),
    new Tower(
        5,
        "Cannon",
        7, // Damage
        170, // Range
        120, // Fire rate
        200, // Cost
        "cannonball" // Projectile type
    ),
    new Tower(
        6,
        "Tesla",
        8, // Damage
        180, // Range
        100, // Fire rate
        250, // Cost
        "lightning" // Projectile type
    )
];