import { useSettingsStore } from '../../store/settingsStore';



/**
 * AudioController - Renamed or repurposed if needed.
 * Previously managed background music. Now it's a placeholder or can be removed if not used.
 * The prompt requested removing BGM logic.
 */
export const AudioController = () => {
    // BGM logic removed.
    return null;
};

/**
 * Hook to play sound effects with volume control
 */
export const useSfx = () => {
    const { sfxVolume } = useSettingsStore();

    const playSfx = (src: string) => {
        if (sfxVolume === 0) return;

        const audio = new Audio(src);
        audio.volume = sfxVolume;
        audio.play().catch(err => {
            console.log('Failed to play SFX:', err);
        });
    };

    return { playSfx };
};
