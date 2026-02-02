import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useFullscreen } from '../../hooks/useFullscreen';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { resetProgress, setShowTutorial } = useGameStore();
    const { isFullscreen, toggleFullscreen, isEnabled: isFullscreenEnabled } = useFullscreen();

    const handleResetProgress = () => {
        if (window.confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
            resetProgress();
            alert('Progress reset successfully!');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className={twMerge(clsx(
                            "relative w-full max-w-2xl overflow-hidden",
                            "bg-black/80 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]",
                            "rounded-sm backdrop-blur-md"
                        ))}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <h1 className="text-3xl font-serif-bold text-white tracking-widest">
                                SETTINGS
                            </h1>
                            <button
                                onClick={onClose}
                                className="text-2xl text-white/50 hover:text-white transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Display Section */}
                            <section>
                                <h2 className="text-xl font-serif text-white/70 mb-4 border-l-2 border-white/30 pl-3">
                                    DISPLAY
                                </h2>
                                <div>
                                    {isFullscreenEnabled ? (
                                        <button
                                            onClick={toggleFullscreen}
                                            className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-serif-bold rounded-sm border border-white/10 hover:border-white/30 transition-all flex items-center justify-between group cursor-pointer"
                                        >
                                            <span className="tracking-wider">{isFullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN'}</span>
                                            <span className="opacity-50 group-hover:opacity-100 transition-opacity">{isFullscreen ? '↙️' : '↗️'}</span>
                                        </button>
                                    ) : (
                                        <p className="text-white/40 italic text-center font-serif py-4">Fullscreen not supported on this device.</p>
                                    )}
                                </div>
                                <div className="space-y-4 mt-4">
                                    {/* <button
                                        onClick={handleResetSettings}
                                        className="w-full px-6 py-4 bg-red-900/20 hover:bg-red-900/40 text-red-200 font-serif-bold rounded-sm border border-red-900/30 hover:border-red-500/50 transition-all text-left"
                                    >
                                        RESET SETTINGS TO DEFAULT
                                    </button> */}
                                    <button
                                        onClick={() => setShowTutorial(true)}
                                        className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-serif-bold rounded-sm border border-white/10 hover:border-white/30 transition-all text-left cursor-pointer"
                                    >
                                        HOW TO PLAY
                                    </button>
                                </div>
                            </section>

                            {/* Danger Zone */}
                            <section>
                                <h2 className="text-xl font-serif text-red-400/80 mb-4 border-l-2 border-red-500/50 pl-3">
                                    RESET PROGRESS
                                </h2>
                                <div className="space-y-4">
                                    {/* <button
                                        onClick={handleResetSettings}
                                        className="w-full px-6 py-4 bg-red-900/20 hover:bg-red-900/40 text-red-200 font-serif-bold rounded-sm border border-red-900/30 hover:border-red-500/50 transition-all text-left"
                                    >
                                        RESET SETTINGS TO DEFAULT
                                    </button> */}
                                    <button
                                        onClick={handleResetProgress}
                                        className="w-full px-6 py-4 bg-red-900/30 hover:bg-red-900/50 text-red-100 font-serif-bold rounded-sm border border-red-900/40 hover:border-red-500/60 transition-all text-left cursor-pointer"
                                    >
                                        RESET ALL GAME PROGRESS
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5 text-center">
                            <button
                                onClick={onClose}
                                className="px-10 py-3 bg-white/10 hover:bg-white/20 text-white font-serif-bold rounded-sm transition-all tracking-widest border border-white/10 hover:border-white/30 cursor-pointer"
                            >
                                CLOSE
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
