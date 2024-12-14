import { Application, Assets, } from 'pixi.js';
import { Game } from './game';
import bundles from '../assets/assetBundle.json';
import AssetLoad from './utils/AssetLoad';

(async () => {
    const app = new Application();
    const canvas = <HTMLCanvasElement>document.getElementById('GameCanvas');
    await app.init({
        background: '#1099bb',
        canvas: canvas,
        width: 1024, height: 800,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });



    await Assets.init({ manifest: { bundles } });
    await Assets.loadBundle('load-maps');
    await Assets.loadBundle('load-uis');
    await Assets.loadBundle('load-tutorial');


    //load atlas
    await AssetLoad.loadAtlas([
        './atlas/towers_atlas.json',
        './atlas/projectiles_atlas.json',
        './atlas/ui_atlas.json',
        './atlas/ui_atlas-0.json',
        './atlas/ui_atlas-1.json'
    ]);

    await AssetLoad.loadBitmap([
        './atlas/fonts/Peaberry.xml',
        './atlas/fonts/Peaberry.fnt',
        './atlas/fonts/ShinyPeaberry.fnt',
        './atlas/fonts/ShinyPeaberry.xml',
        './atlas/fonts/RedPeaberry.fnt',
        './atlas/fonts/RedPeaberry.xml',
        './atlas/fonts/GoldPeaberry.fnt',
        './atlas/fonts/GoldPeaberry.xml'
    ]);

    await AssetLoad.loadAnimations([
        './atlas/enemies_atlas.json',
        './atlas/weapons_atlas.json',
        './atlas/impacts_atlas.json',
        './atlas/projectiles_atlas.json',
        './atlas/heros_atlas.json',
        './atlas/skills_atlas.json'
    ]);

    await AssetLoad.loadSoundSprite
        ([
            { alias: 'game_sound', path: './sounds/game_sounds.json' },
            { alias: 'effect_sound', path: './sounds/effect_sounds.json' }
        ]);


    const game = new Game(app);
    game.start();
})();


