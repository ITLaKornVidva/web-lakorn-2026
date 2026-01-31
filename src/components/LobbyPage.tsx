import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SettingsModal } from './UI/SettingsModal';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const LobbyPage = () => {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handlePlay = () => {
        navigate('/character-select');
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8 lg:gap-12 w-full px-4">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif-bold text-white tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        La Dernière
                    </h1>
                </motion.div>

                {/* Main Buttons */}
                <div className="flex flex-col gap-3 md:gap-6 w-60 md:w-96 shrink-0">
                    <motion.button
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        onClick={handlePlay}
                        className={twMerge(clsx(
                            "group relative px-6 py-3 md:px-8 md:py-5 border border-white/30 backdrop-blur-md rounded-sm overflow-hidden transition-all duration-300",
                            "hover:border-white/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
                            "bg-black/20 hover:bg-black/40",
                            "cursor-pointer"
                        ))}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10 text-2xl md:text-4xl font-serif-bold text-white tracking-widest group-hover:tracking-[0.15em] transition-all">
                            PLAY
                        </span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        onClick={() => setIsSettingsOpen(true)}
                        className={twMerge(clsx(
                            "group relative px-6 py-2 md:px-8 md:py-4 border border-white/20 backdrop-blur-sm rounded-sm overflow-hidden transition-all duration-300",
                            "hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                            "bg-black/20 hover:bg-black/40",
                            "cursor-pointer"
                        ))}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10 text-lg md:text-2xl font-serif-bold text-white/90 tracking-widest group-hover:tracking-[0.15em] transition-all">
                            SETTINGS
                        </span>
                    </motion.button>
                </div>
            </div>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};
