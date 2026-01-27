import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    sfxVolume: number; // 0-1

    // Actions
    setSfxVolume: (volume: number) => void;
    resetSettings: () => void;
}

const defaultSettings = {
    sfxVolume: 0.7,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,

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
