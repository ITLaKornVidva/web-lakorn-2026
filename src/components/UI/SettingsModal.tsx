import { useSettingsStore } from '../../store/settingsStore';
import { useGameStore } from '../../store/gameStore';
import { useFullscreen } from '../../hooks/useFullscreen';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { sfxVolume, setSfxVolume, resetSettings } = useSettingsStore();
    const { resetProgress } = useGameStore();
    const { isFullscreen, toggleFullscreen, isEnabled: isFullscreenEnabled } = useFullscreen();

    if (!isOpen) return null;

    const handleResetProgress = () => {
        if (window.confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
            resetProgress();
            alert('Progress reset successfully!');
        }
    };

    const handleResetSettings = () => {
        if (window.confirm('Reset all settings to default values?')) {
            resetSettings();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-70 p-4" onClick={onClose}>
            <div
                className="max-w-2xl w-full bg-[#f5e6d3] border-4 border-[#2c1810] rounded-sm shadow-2xl p-8 max-h-[90vh] overflow-y-auto touch-pan-y overscroll-contain bg-[url('/assets/backgrounds/paper-texture.png')] bg-blend-multiply"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="flex justify-between items-center mb-6 border-b-2 border-[#5C4033]/30 pb-4">
                    <h1 className="text-4xl font-serif-bold text-[#2c1810] tracking-wide">
                        ⚙️ Settings
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-3xl text-[#5C4033] hover:text-[#2c1810] transition-colors font-serif"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Audio Settings Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-serif-bold text-[#5C4033] mb-4 flex items-center gap-2">
                        🔊 Audio Settings
                    </h2>
                    <div className="space-y-6">
                        {/* SFX Volume */}
                        <div>
                            <label className="block text-sm font-bold text-[#5C4033] mb-2 uppercase tracking-wider">
                                Sound Effects Volume: {Math.round(sfxVolume * 100)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-[#D2B48C]/50 rounded-lg appearance-none cursor-pointer accent-[#8B5A2B]"
                            />
                            <div className="flex justify-between text-xs text-[#5C4033]/70 mt-1 font-serif">
                                <span>Mute</span>
                                <span>Max</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Display & App Section */}
                <section className="mb-8 border-t-2 border-[#5C4033]/30 pt-6">
                    <h2 className="text-2xl font-serif-bold text-[#5C4033] mb-4 flex items-center gap-2">
                        📱 Display
                    </h2>
                    <div className="space-y-4">
                        {isFullscreenEnabled && (
                            <button
                                onClick={toggleFullscreen}
                                className="w-full px-6 py-3 bg-[#e8dcc5] text-[#2c1810] font-serif-bold rounded-sm border border-[#5C4033]/50 hover:bg-[#D2B48C] transition-colors flex items-center justify-center gap-2"
                            >
                                <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                                <span>{isFullscreen ? '↙️' : '↗️'}</span>
                            </button>
                        )}

                        {!isFullscreenEnabled && (
                            <p className="text-[#5C4033]/60 italic text-center font-serif">No additional display options available for this device.</p>
                        )}
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="border-t-2 border-[#5C4033]/30 pt-6">
                    <h2 className="text-2xl font-serif-bold text-[#8B0000] mb-4 flex items-center gap-2">
                        ⚠️ Danger Zone
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={handleResetSettings}
                            className="w-full px-6 py-3 bg-[#5C4033] text-[#f5e6d3] font-serif-bold rounded-sm hover:bg-[#3e2b22] transition-colors border border-[#2c1810]"
                        >
                            Reset Settings to Default
                        </button>
                        <button
                            onClick={handleResetProgress}
                            className="w-full px-6 py-3 bg-[#8B0000] text-[#f5e6d3] font-serif-bold rounded-sm hover:bg-[#600000] transition-colors border border-[#2c1810]"
                        >
                            Reset All Game Progress
                        </button>
                    </div>
                </section>

                {/* Close Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-[#8B5A2B] text-[#f5e6d3] font-serif-bold rounded-sm hover:bg-[#5C4033] transition-colors shadow-lg uppercase tracking-widest border border-[#2c1810]"
                    >
                        Close Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
