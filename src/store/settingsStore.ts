import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    // Actions
    resetSettings: () => void;
}

const defaultSettings = {};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,

            resetSettings: () => set(defaultSettings),
        }),
        {
            name: 'lakorn-settings-storage',
        }
    )
);
