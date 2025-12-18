import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    bgmVolume: number; // 0-1
    sfxVolume: number; // 0-1

    // Actions
    setBgmVolume: (volume: number) => void;
    setSfxVolume: (volume: number) => void;
    resetSettings: () => void;
}

const defaultSettings = {
    bgmVolume: 0.5,
    sfxVolume: 0.7,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,

            setBgmVolume: (volume: number) => {
                const clampedVolume = Math.max(0, Math.min(1, volume));
                set({ bgmVolume: clampedVolume });
            },

            setSfxVolume: (volume: number) => {
                const clampedVolume = Math.max(0, Math.min(1, volume));
                set({ sfxVolume: clampedVolume });
            },

            resetSettings: () => set(defaultSettings),
        }),
        {
            name: 'lakorn-settings-storage',
        }
    )
);
