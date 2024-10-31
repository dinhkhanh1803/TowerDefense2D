import { AnimatedSprite, Application, Assets, } from 'pixi.js';
import { Game } from './game';
import { GameBoard } from './scenes/GameBoard';
import bundles from '../assets/assetBundle.json';
import AssetLoad from './utils/AssetLoad';

(async () => {
    const app = new Application();
    await app.init({
        background: '#1099bb',
        width: 1024, height: 800,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });
    document.body.appendChild(app.canvas);


    await Assets.init({ manifest: { bundles } });
    await Assets.loadBundle('load-atlas');

    //load atlas
    await AssetLoad.loadAtlas([
        './atlas/towers_atlas.json',
        './atlas/projectiles_atlas.json',
        './atlas/ui_atlas.json'
    ]);

    await AssetLoad.loadBitmap([
        './atlas/fonts/Peaberry.xml',
        './atlas/fonts/Peaberry.fnt',
        './atlas/fonts/ShinyPeaberry.fnt',
        './atlas/fonts/ShinyPeaberry.xml',
        './atlas/fonts/RedPeaberry.fnt',
        './atlas/fonts/RedPeaberry.xml'
    ]);

    await AssetLoad.loadAnimations([
        './atlas/enemies_atlas.json',
        './atlas/weapons_atlas.json',
        './atlas/impacts_atlas.json'
    ]);


    const game = new Game(app);
    game.start();

})();


