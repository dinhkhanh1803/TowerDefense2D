import { sound } from "@pixi/sound";
import { EventHandle } from "../utils/EventHandle";
import { Assets, Sprite } from "pixi.js";
import { GameSave } from "../utils/GameSave";
import AssetLoad from "../utils/AssetLoad";
import { GameTypes } from "../types/GameTypes";

export class SoundManager {
    public static instance: SoundManager;
    public soundButton: Sprite;
    public isMuted: boolean;

    constructor() {
        SoundManager.instance = this;
        this.isMuted = GameSave.loadSoundSetting();
        this.soundButton = this.createSoundButton();
        this._add();
        this._listenEventHandle();
    }

    private _listenEventHandle() {
        EventHandle.on(GameTypes.event.playSound, (sound_key, { sprite, loop, volume }) => {
            this._play(sound_key, { sprite, loop, volume });
        });

        EventHandle.on(GameTypes.event.stopSound, (sound_key) => {
            this._stop(sound_key);
        });

        EventHandle.on(GameTypes.event.sceneChange, (newSceneName) => {
            this._stopAllSounds();
        });

        EventHandle.on(GameTypes.event.toggleSound, (sound_key, { sprite, loop, volume }) => {
            this.toggleSound(sound_key, { sprite, loop, volume });
        });
    }

    private _add() {
        ['game_sound', 'effect_sound'].forEach(alias => {
            const soundData = Assets.get(alias);
            if (soundData) {
                sound.add(alias, {
                    url: soundData.resources[0],  // Đường dẫn đến file âm thanh
                    sprites: soundData.spritemap  // Định nghĩa các đoạn âm thanh trong sprite
                });
            } else {
                console.warn(`Sound sprite with alias '${alias}' not found.`);
            }
        });
    }

    private _play(soundKey: string, options?: { sprite: string, loop?: boolean, volume?: number }): void {
        if (this.isMuted) return;

        const soundInstance = sound.find(soundKey);
        if (soundInstance) {
            sound.play(soundKey, {
                sprite: options ?.sprite,
                loop: options ?.loop ?? false,
                volume: options ?.volume
            });
        }
    }



    private _stop(soundKey: string): void {
        sound.stop(soundKey);
    }

    private _stopAllSounds(): void {
        sound.stopAll();
    }

    private toggleSound(soundKey: string, options?: { sprite: string, loop?: boolean, volume?: number }): void {
        this.isMuted = !this.isMuted;
        if (!this.isMuted) {
            this._play(soundKey, options);
        } else {
            this._stopAllSounds();
        }
        this.updateSoundButtonTexture();
        GameSave.saveSoundSetting(this.isMuted);
    }

    public createSoundButton(): Sprite {
        const soundBtn = new Sprite(AssetLoad.getTexture(this.isMuted ? 'mute' : 'sound'));
        soundBtn.position.set(950, 700);
        soundBtn.interactive = true;
        soundBtn.eventMode = 'static';
        soundBtn.cursor = 'pointer';
        soundBtn.scale.set(0.8);
        soundBtn.on('pointerup', () => {
            EventHandle.emit(GameTypes.event.toggleSound, 'game_sound', {
                sprite: 'gametitle',
                loop: true,
                volume: 0.8
            });
        });
        return soundBtn;
    }

    private updateSoundButtonTexture(): void {
        this.soundButton.texture = AssetLoad.getTexture(this.isMuted ? 'mute' : 'sound');
    }

    public getSoundButton(): Sprite {
        return this.soundButton;
    }
}