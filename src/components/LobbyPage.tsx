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
        navigate('/game/character-select');
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Spinning Gears */}
                <motion.svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute -top-24 -left-24 max-md:w-48 max-md:h-48 w-64 h-64 text-black/30 blur-[2px]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    <path d="M22,12c0-0.3-0.02-0.59-0.07-0.88l-2.48-0.95c-0.21-0.79-0.56-1.53-1-2.2l1.62-2.1c-0.51-0.88-1.15-1.66-1.9-2.32l-2.52,0.85C15.02,3.95,14.34,3.63,13.61,3.43L13.1,0.84C12.74,0.76,12.37,0.72,12,0.72s-0.74,0.04-1.1,0.12L10.39,3.43c-0.73,0.2-1.41,0.52-2.04,0.95L5.83,3.53c-0.75,0.66-1.39,1.44-1.9,2.32l1.62,2.1c-0.45,0.67-0.79,1.41-1,2.2l-2.49,0.95C2.02,11.41,2,11.7,2,12s0.02,0.59,0.07,0.88l2.48,0.95c0.21,0.79,0.56,1.53,1,2.2l-1.62,2.1c0.51,0.88,1.15,1.66,1.9,2.32l2.52-0.85c0.63,0.44,1.31,0.76,2.04,0.96l0.51,2.59C11.26,23.16,11.63,23.2,12,23.2s0.74-0.04,1.1-0.12l0.51-2.59c0.73-0.2,1.41-0.52,2.04-0.96l2.52,0.85c0.75-0.66,1.39-1.44,1.9-2.32l-1.62-2.1c0.45-0.67,0.79-1.41,1-2.2l2.49-0.95C21.98,12.59,22,12.3,22,12z M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5S14.76,17,12,17z" />
                </motion.svg>
                <motion.svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute bottom-10 -right-20 max-md:w-48 max-md:h-48 w-64 h-64 text-black/30 blur-[2px]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <path d="M22,12c0-0.3-0.02-0.59-0.07-0.88l-2.48-0.95c-0.21-0.79-0.56-1.53-1-2.2l1.62-2.1c-0.51-0.88-1.15-1.66-1.9-2.32l-2.52,0.85C15.02,3.95,14.34,3.63,13.61,3.43L13.1,0.84C12.74,0.76,12.37,0.72,12,0.72s-0.74,0.04-1.1,0.12L10.39,3.43c-0.73,0.2-1.41,0.52-2.04,0.95L5.83,3.53c-0.75,0.66-1.39,1.44-1.9,2.32l1.62,2.1c-0.45,0.67-0.79,1.41-1,2.2l-2.49,0.95C2.02,11.41,2,11.7,2,12s0.02,0.59,0.07,0.88l2.48,0.95c0.21,0.79,0.56,1.53,1,2.2l-1.62,2.1c0.51,0.88,1.15,1.66,1.9,2.32l2.52-0.85c0.63,0.44,1.31,0.76,2.04,0.96l0.51,2.59C11.26,23.16,11.63,23.2,12,23.2s0.74-0.04,1.1-0.12l0.51-2.59c0.73-0.2,1.41-0.52,2.04-0.96l2.52,0.85c0.75-0.66,1.39-1.44,1.9-2.32l-1.62-2.1c0.45-0.67,0.79-1.41,1-2.2l2.49-0.95C21.98,12.59,22,12.3,22,12z M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5S14.76,17,12,17z" />
                </motion.svg>

                <motion.svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute bottom-90 -right-15 max-md:bottom-60 max-md:-right-10 max-md:w-24 max-md:h-24 w-40 h-40 text-black/30 blur-[2px]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <path d="M22,12c0-0.3-0.02-0.59-0.07-0.88l-2.48-0.95c-0.21-0.79-0.56-1.53-1-2.2l1.62-2.1c-0.51-0.88-1.15-1.66-1.9-2.32l-2.52,0.85C15.02,3.95,14.34,3.63,13.61,3.43L13.1,0.84C12.74,0.76,12.37,0.72,12,0.72s-0.74,0.04-1.1,0.12L10.39,3.43c-0.73,0.2-1.41,0.52-2.04,0.95L5.83,3.53c-0.75,0.66-1.39,1.44-1.9,2.32l1.62,2.1c-0.45,0.67-0.79,1.41-1,2.2l-2.49,0.95C2.02,11.41,2,11.7,2,12s0.02,0.59,0.07,0.88l2.48,0.95c0.21,0.79,0.56,1.53,1,2.2l-1.62,2.1c0.51,0.88,1.15,1.66,1.9,2.32l2.52-0.85c0.63,0.44,1.31,0.76,2.04,0.96l0.51,2.59C11.26,23.16,11.63,23.2,12,23.2s0.74-0.04,1.1-0.12l0.51-2.59c0.73-0.2,1.41-0.52,2.04-0.96l2.52,0.85c0.75-0.66,1.39-1.44,1.9-2.32l-1.62-2.1c0.45-0.67,0.79-1.41,1-2.2l2.49-0.95C21.98,12.59,22,12.3,22,12z M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5S14.76,17,12,17z" />
                </motion.svg>

                <motion.svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute bottom-16 -left-20 max-md:bottom-10 max-md:-left-10 w-40 h-40 max-md:w-24 max-md:h-24 text-black/30 blur-[2px]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                    <path d="M22,12c0-0.3-0.02-0.59-0.07-0.88l-2.48-0.95c-0.21-0.79-0.56-1.53-1-2.2l1.62-2.1c-0.51-0.88-1.15-1.66-1.9-2.32l-2.52,0.85C15.02,3.95,14.34,3.63,13.61,3.43L13.1,0.84C12.74,0.76,12.37,0.72,12,0.72s-0.74,0.04-1.1,0.12L10.39,3.43c-0.73,0.2-1.41,0.52-2.04,0.95L5.83,3.53c-0.75,0.66-1.39,1.44-1.9,2.32l1.62,2.1c-0.45,0.67-0.79,1.41-1,2.2l-2.49,0.95C2.02,11.41,2,11.7,2,12s0.02,0.59,0.07,0.88l2.48,0.95c0.21,0.79,0.56,1.53,1,2.2l-1.62,2.1c0.51,0.88,1.15,1.66,1.9,2.32l2.52-0.85c0.63,0.44,1.31,0.76,2.04,0.96l0.51,2.59C11.26,23.16,11.63,23.2,12,23.2s0.74-0.04,1.1-0.12l0.51-2.59c0.73-0.2,1.41-0.52,2.04-0.96l2.52,0.85c0.75-0.66,1.39-1.44,1.9-2.32l-1.62-2.1c0.45-0.67,0.79-1.41,1-2.2l2.49-0.95C21.98,12.59,22,12.3,22,12z M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5S14.76,17,12,17z" />
                </motion.svg>

            </div>

            <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8 lg:gap-12 w-full px-4">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif-bold text-black/90 tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] SOV_YeeHor">
                        The Missing Scenes
                    </h1>
                </motion.div>

                {/* Main Buttons */}
                <div className="flex flex-col gap-3 md:gap-6 w-60 md:w-96 shrink-0">
                    <motion.button
                        initial={{ opacity: 0, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        onClick={handlePlay}
                        className={twMerge(clsx(
                            "group relative px-6 py-3 md:px-8 md:py-5 border border-white/30 backdrop-blur-md rounded-sm overflow-hidden transition-all duration-300",
                            "hover:border-white/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
                            "bg-black/80 hover:bg-black/90",
                            "cursor-pointer"
                        ))}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10 text-2xl md:text-4xl font-serif-bold text-white tracking-widest group-hover:tracking-[0.15em] transition-all">
                            PLAY
                        </span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                        onClick={() => setIsSettingsOpen(true)}
                        className={twMerge(clsx(
                            "group relative px-6 py-2 md:px-8 md:py-4 border border-white/20 backdrop-blur-sm rounded-sm overflow-hidden transition-all duration-300",
                            "hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                            "bg-black/80 hover:bg-black/90",
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
