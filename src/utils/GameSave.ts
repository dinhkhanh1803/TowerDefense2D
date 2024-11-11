export class GameSave {
    private static STORAGE_KEY = 'gameData_key_';
    private static SOUND_KEY = 'soundEnabled_';
    private static LEVEL_KEY = 'currentLevel_';

    private static hashKey(key: string, length: number = 10): string {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash |= 0; // Chuyển đổi sang 32-bit integer
        }
        // Chuyển thành chuỗi base 16 (hex) và cắt theo độ dài yêu cầu
        return Math.abs(hash).toString(16).substring(0, length);
    }

    // Phương thức để lưu dữ liệu game vào localStorage
    static saveGame(soundEnabled: boolean, volume: number): void {
        const gameData = {
            soundEnabled: soundEnabled,
            volume: volume // Lưu âm lượng
        };
        const dataString = JSON.stringify(gameData);
        localStorage.setItem(GameSave.STORAGE_KEY, dataString);
    }

    // Phương thức để tải dữ liệu game từ localStorage
    static loadGame(): { soundEnabled: boolean, volume: number } | null {
        const savedData = localStorage.getItem(GameSave.STORAGE_KEY);
        if (savedData) {
            return JSON.parse(savedData);
        }
        return null;
    }

    static clearData() {
        localStorage.clear();
    }

    // Phương thức để lưu thiết lập âm thanh
    static saveSoundSetting(soundEnabled: boolean): void {
        const hashedKey = GameSave.SOUND_KEY + GameSave.hashKey(GameSave.SOUND_KEY);
        localStorage.setItem(hashedKey, JSON.stringify(soundEnabled));
    }

    // Phương thức để tải thiết lập âm thanh
    static loadSoundSetting(): boolean {
        const hashedKey = GameSave.SOUND_KEY + GameSave.hashKey(GameSave.SOUND_KEY);
        const savedSoundSetting = localStorage.getItem(hashedKey);
        return savedSoundSetting ? JSON.parse(savedSoundSetting) : false;
    }

    static saveCurrentLevel(level: number): void {
        const hashedKey = GameSave.LEVEL_KEY + GameSave.hashKey(GameSave.LEVEL_KEY);
        localStorage.setItem(hashedKey, JSON.stringify(level));
    }

    static loadCurrentLevel(): number {
        const hashedKey = GameSave.LEVEL_KEY + GameSave.hashKey(GameSave.LEVEL_KEY);
        const savedLevel = localStorage.getItem(hashedKey);
        return savedLevel ? JSON.parse(savedLevel) : 1;
    }
}