import { useSettingsStore } from '../../store/settingsStore';
import { useGameStore } from '../../store/gameStore';
import { useFullscreen } from '../../hooks/useFullscreen';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { bgmVolume, sfxVolume, setBgmVolume, setSfxVolume, resetSettings } = useSettingsStore();
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
                className="max-w-2xl w-full bg-white border-4 border-slate-800 rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto touch-pan-y overscroll-contain"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="flex justify-between items-center mb-6 border-b-2 border-slate-300 pb-4">
                    <h1 className="text-4xl font-serif text-slate-800">
                        ⚙️ Settings
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-3xl text-slate-600 hover:text-slate-800 transition-colors"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Audio Settings Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-serif text-slate-700 mb-4 flex items-center gap-2">
                        🔊 Audio Settings
                    </h2>
                    <div className="space-y-6">
                        {/* BGM Volume */}
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">
                                Background Music Volume: {Math.round(bgmVolume * 100)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={bgmVolume}
                                onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Mute</span>
                                <span>Max</span>
                            </div>
                        </div>

                        {/* SFX Volume */}
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">
                                Sound Effects Volume: {Math.round(sfxVolume * 100)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Mute</span>
                                <span>Max</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Display & App Section */}
                <section className="mb-8 border-t-2 border-slate-300 pt-6">
                    <h2 className="text-2xl font-serif text-slate-700 mb-4 flex items-center gap-2">
                        📱 Display
                    </h2>
                    <div className="space-y-4">
                        {isFullscreenEnabled && (
                            <button
                                onClick={toggleFullscreen}
                                className="w-full px-6 py-3 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition-colors border border-slate-300 flex items-center justify-center gap-2"
                            >
                                <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                                <span>{isFullscreen ? '↙️' : '↗️'}</span>
                            </button>
                        )}

                        {!isFullscreenEnabled && (
                            <p className="text-slate-500 italic text-center">No additional display options available for this device.</p>
                        )}
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="border-t-2 border-slate-300 pt-6">
                    <h2 className="text-2xl font-serif text-red-700 mb-4 flex items-center gap-2">
                        ⚠️ Danger Zone
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={handleResetSettings}
                            className="w-full px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Reset Settings to Default
                        </button>
                        <button
                            onClick={handleResetProgress}
                            className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Reset All Game Progress
                        </button>
                    </div>
                </section>

                {/* Close Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
                    >
                        Close Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
