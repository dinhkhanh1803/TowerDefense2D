// src/data/levels.ts

import { Tower } from "../models/Tower";
import { TowerType } from "../types/TowerType";

export const levels = [
    {
        levelNumber: 1,
        nameMap: 'Map 1',
        difficulty: 'easy',
        map: {
            tiles: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 1
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 2
                [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 3
                [0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 4
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0], // Hàng 5
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], // Hàng 6
                [0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // Hàng 7
                [0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 1, 2, 0, 0, 0, 0], // Hàng 8
                [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // Hàng 9
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 10
            ],
            tileSize: 64, // Kích thước mỗi ô vuông (64px x 64px)
        },
        waves: [
            {
                enemies: [
                    { type: 'Grunt', count: 5 },
                ],
                spawnPoints: [{ x: 0, y: 2 }],
                defendPoint: { x: 15, y: 5 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 2 },
                    { type: 'Monster', count: 3 },
                ],
                spawnPoints: [{ x: 0, y: 2 }],
                defendPoint: { x: 15, y: 5 },
            },
        ],
        spawnInterval: 200,
        waveInterval: 500,
        towersAvailable: [TowerType.Archer, TowerType.Mage, TowerType.Cannon],
        resources: {
            gold: 300,
            health: 10
        }
    },
    {
        levelNumber: 2,
        nameMap: 'Map 2',
        difficulty: 'easy',
        map: {
            tiles: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 1
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0], // Hàng 2
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0], // Hàng 3
                [0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 2, 1, 0, 0, 0], // Hàng 4
                [0, 0, 1, 0, 2, 1, 0, 2, 1, 0, 0, 0, 1, 0, 0, 0], // Hàng 5
                [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1], // Hàng 6
                [0, 2, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0], // Hàng 7
                [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // Hàng 8
                [0, 0, 1, 0, 2, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0], // Hàng 9
                [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 10
            ],
            tileSize: 64, // Kích thước mỗi ô vuông (64px x 64px)
        },
        waves: [
            {
                enemies: [
                    { type: 'Grunt', count: 5 },
                    { type: 'Monster', count: 4 }

                ],
                spawnPoints: [{ x: 2, y: 9 }],
                defendPoint: { x: 15, y: 5 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 4 },
                    { type: 'Monster', count: 6 }
                ],
                spawnPoints: [{ x: 2, y: 9 }],
                defendPoint: { x: 15, y: 5 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 5 },
                    { type: 'Monster', count: 5 },
                    { type: 'Giant', count: 3 }
                ],
                spawnPoints: [{ x: 2, y: 9 }],
                defendPoint: { x: 15, y: 5 },
            },
        ],
        spawnInterval: 200,
        waveInterval: 500,
        towersAvailable: [TowerType.Archer, TowerType.Mage, TowerType.Cannon, TowerType.Fire],
        resources: {
            gold: 350,
            health: 10
        }
    },
    {
        levelNumber: 3,
        nameMap: 'Map 3',
        difficulty: 'easy',
        map: {
            tiles: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // Hàng 1
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0], // Hàng 2
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // Hàng 3
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0], // Hàng 4
                [0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0], // Hàng 5
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // Hàng 6
                [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0], // Hàng 7
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], // Hàng 8
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0], // Hàng 9
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 10
            ],
            tileSize: 64, // Kích thước mỗi ô vuông (64px x 64px)
        },
        waves: [
            {
                enemies: [
                    { type: 'Grunt', count: 5 },
                    { type: 'Monster', count: 6 }

                ],
                spawnPoints: [{ x: 0, y: 5 }],
                defendPoint: { x: 15, y: 7 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 7 },
                    { type: 'Monster', count: 6 },
                    { type: 'Giant', count: 5 },
                ],
                spawnPoints: [{ x: 10, y: 0 }],
                defendPoint: { x: 15, y: 7 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 7 },
                    { type: 'Monster', count: 6 },
                    { type: 'Giant', count: 5 },
                    { type: 'Speedster', count: 3 },
                ],
                spawnPoints: [{ x: 0, y: 5 }, { x: 10, y: 0 }],
                defendPoint: { x: 15, y: 7 },
            },
        ],
        spawnInterval: 200,
        waveInterval: 500,
        towersAvailable: [TowerType.Archer, TowerType.Mage, TowerType.Cannon, TowerType.Fire, TowerType.Ice],
        resources: {
            gold: 400,
            health: 10
        }
    },
    {
        levelNumber: 4,
        nameMap: 'Map 4',
        difficulty: 'easy',
        map: {
            tiles: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Hàng 1
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Hàng 2
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0], // Hàng 3
                [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Hàng 4
                [0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 2, 0, 0, 0], // Hàng 5
                [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0], // Hàng 6
                [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0], // Hàng 7
                [0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 2, 1, 0, 0, 0, 0], // Hàng 8
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // Hàng 9
                [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 10
            ],
            tileSize: 64, // Kích thước mỗi ô vuông (64px x 64px)
        },
        waves: [
            {
                enemies: [
                    { type: 'Grunt', count: 8 },
                    { type: 'Monster', count: 7 },
                    { type: 'Giant', count: 6 }
                ],
                spawnPoints: [{ x: 15, y: 3 }],
                defendPoint: { x: 7, y: 9 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 8 },
                    { type: 'Monster', count: 7 },
                    { type: 'Giant', count: 6 }

                ],
                spawnPoints: [{ x: 11, y: 0 }],
                defendPoint: { x: 3, y: 9 },
            },
        ],
        spawnInterval: 200,
        waveInterval: 500,
        towersAvailable: [TowerType.Archer, TowerType.Mage, TowerType.Cannon, TowerType.Fire, TowerType.Ice, TowerType.Tesla],
        resources: {
            gold: 500,
            health: 10
        }
    },
    {
        levelNumber: 5,
        nameMap: 'Map 5',
        difficulty: 'easy',
        map: {
            tiles: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 1
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // Hàng 2
                [0, 2, 0, 0, 0, 2, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0], // Hàng 3
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // Hàng 4
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0], // Hàng 5
                [0, 0, 0, 2, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0], // Hàng 6
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // Hàng 7
                [0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Hàng 8
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // Hàng 9
                [0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0], // Hàng 10
            ],
            tileSize: 64, // Kích thước mỗi ô vuông (64px x 64px)
        },
        waves: [
            {
                enemies: [
                    { type: 'Grunt', count: 5 },
                    { type: 'Monster', count: 5 },
                    { type: 'Giant', count: 6 }
                ],
                spawnPoints: [{ x: 0, y: 1 }],
                defendPoint: { x: 15, y: 3 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 6 },
                    { type: 'Giant', count: 7 },
                    { type: 'Speedster', count: 6 },
                    { type: 'Giant', count: 7 }
                ],
                spawnPoints: [{ x: 0, y: 1 }, { x: 9, y: 9 }],
                defendPoint: { x: 15, y: 3 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 5 },
                    { type: 'Giant', count: 6 },
                    { type: 'Speedster', count: 5 },
                    { type: 'Giant', count: 6 }
                ],
                spawnPoints: [{ x: 0, y: 1 }, { x: 9, y: 9 }],
                defendPoint: { x: 15, y: 3 },
            },
            {
                enemies: [
                    { type: 'Boss', count: 1 },
                ],
                spawnPoints: [{ x: 0, y: 1 }],
                defendPoint: { x: 15, y: 3 },
            },
            {
                enemies: [
                    { type: 'Grunt', count: 5 },
                    { type: 'Giant', count: 6 },
                    { type: 'Speedster', count: 5 },
                    { type: 'Giant', count: 6 }
                ],
                spawnPoints: [{ x: 9, y: 9 }],
                defendPoint: { x: 15, y: 3 },
            },
        ],
        spawnInterval: 200,
        waveInterval: 500,
        towersAvailable: [TowerType.Archer, TowerType.Mage, TowerType.Cannon, TowerType.Fire, TowerType.Ice, TowerType.Tesla],
        resources: {
            gold: 500,
            health: 20
        }
    }
];
