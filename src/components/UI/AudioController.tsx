import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

interface AudioControllerProps {
    bgmSrc?: string; // Path to background music file
}

/**
 * AudioController - Invisible component that manages background music playback
 * based on settings store volume levels. This component doesn't render anything,
 * it only handles audio playback logic.
 */
export const AudioController = ({ bgmSrc }: AudioControllerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { bgmVolume } = useSettingsStore();

    useEffect(() => {
        // Only create audio element if bgmSrc is provided
        if (!bgmSrc) return;

        // Create audio element
        const audio = new Audio(bgmSrc);
        audio.loop = true;
        audioRef.current = audio;

        // Start playing
        const playPromise = audio.play();

        // Handle autoplay restrictions
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Auto-play was prevented:', error);
                // You might want to show a "Click to enable music" button here
            });
        }

        // Cleanup on unmount
        return () => {
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, [bgmSrc]);

    // Update volume when settings change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = bgmVolume;

            // Pause if volume is 0, resume if volume > 0
            if (bgmVolume === 0) {
                audioRef.current.pause();
            } else if (audioRef.current.paused) {
                audioRef.current.play().catch(err => {
                    console.log('Failed to resume audio:', err);
                });
            }
        }
    }, [bgmVolume]);

    // This component doesn't render anything
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
