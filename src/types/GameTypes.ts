export namespace GameTypes {
    export const GAME_WIDTH = 1024;
    export const GAME_HEIGHT = 800;
    export const MAP_WIDTH = 1024;
    export const MAP_HEIGHT = 640;

    export const UI_BOTTOM_WIDTH = 1024;
    export const UI_BOTTOM_HEIGHT = 160;


    export const tower = {
        damageUpgrade: 1.2,
        rangeUpgrade: 1.1,
        costUpgrade: 1.5,
        speedUpgrade: 1.2,


    }
    export const event = {
        addChildToMap: 'add-child-to-scene',
        removeChildFromMap: 'remove-child-from-scene',
        gameResult: 'gameResult',
        playSound: 'play-sound',
        stopSound: 'stop-sound',
        sceneChange: 'scene-changed',
        toggleSound: 'toggle-sound',
        movePosition: 'postion_click',
        skillPosition: 'postion_skill_click',
        addStar: 'add_star'
    };
}