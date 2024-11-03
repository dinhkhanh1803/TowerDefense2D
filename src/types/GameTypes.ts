export namespace GameTypes {
    export const GAME_WIDTH = 1024;
    export const GAME_HEIGHT = 800;
    export const MAP_WIDTH = 1024;
    export const MAP_HEIGHT = 640;

    export const UI_BOTTOM_WIDTH = 1024;
    export const UI_BOTTOM_HEIGHT = 160;



    export const event = {
        addChildToMap: 'add-child-to-scene',
        removeChildFromMap: 'remove-child-from-scene',
        gameResult: 'gameResult',
        fireBullet: 'fire-bullet',
        createBullet: 'create-bullet',
        removeBullet: 'remove-bullet',
        createTower: 'create-tower',
        destroyTower: 'destroy-tower',
        destroyBullet: 'destroy-bullet',
        createUnit: 'create-unit',
        removeEnemy: 'remove-enemy',
        addToUIBoard: 'add-to-ui-board',
        removeFromUiBoard: 'remove-from-ui-board',
        selectTowerBase: 'select-tower-base',
        plusGold: 'plus-gold',
        reduceGold: 'reduce-gold',
        resetBoard: 'reset-board',
        displayTowerInfo: 'displayTowerInfo',
        upgradeTower: 'upgrade-tower',
        displayWave: 'display-wave',
        reduceBaseHp: 'reduce-base-hp',
        gameOver: 'game-over',
        gameStart: 'game-start',
        createAllyUnit: 'create-ally-unit',
        createTowerIllusion: 'create-tower-illusion',
        invisibleTowerIllusion: 'invisible-tower-illusion',
        saveGame: 'save-game',
        toggleSound: 'toggle-sound',
        soundIconClicked: 'sound-icon-clicked'
    };
}