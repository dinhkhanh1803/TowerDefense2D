// src/types/LevelData.ts

import { TowerType } from "./TowerType";

// Xuất interface LevelData để các file khác có thể import
export interface LevelTypes {
    levelNumber: number;
    nameMap: string;
    difficulty: string;
    map: {
        tiles: number[][];
        tileSize: number;
    };
    waves: Array<{
        enemies: Array<{ type: string; count: number }>;
        spawnPoints: Array<{ x: number, y: number }>;
        defendPoint: { x: number; y: number };
    }>;
    spawnInterval: number;
    waveInterval: number;
    towersAvailable: TowerType[];
    resources: {
        gold: number;
        health: number;
    };
}
