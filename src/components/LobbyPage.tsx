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
            <div className="relative z-10 flex flex-col items-center gap-12">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif-bold text-white tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        La Dernière
                    </h1>
                    {/* <p className="text-xl md:text-2xl text-white/80 font-serif tracking-[0.2em] mt-4 uppercase">
                        La Dernière
                    </p> */}
                </motion.div>

                {/* Main Buttons */}
                <div className="flex flex-col gap-6 w-72 md:w-96">
                    <motion.button
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        onClick={handlePlay}
                        className={twMerge(clsx(
                            "group relative px-8 py-5 border border-white/30 backdrop-blur-md rounded-sm overflow-hidden transition-all duration-300",
                            "hover:border-white/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
                            "bg-black/20 hover:bg-black/40",
                            "cursor-pointer"
                        ))}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10 text-3xl md:text-4xl font-serif-bold text-white tracking-widest group-hover:tracking-[0.15em] transition-all">
                            PLAY
                        </span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        onClick={() => setIsSettingsOpen(true)}
                        className={twMerge(clsx(
                            "group relative px-8 py-4 border border-white/20 backdrop-blur-sm rounded-sm overflow-hidden transition-all duration-300",
                            "hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                            "bg-black/20 hover:bg-black/40",
                            "cursor-pointer"
                        ))}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10 text-xl md:text-2xl font-serif-bold text-white/90 tracking-widest group-hover:tracking-[0.15em] transition-all">
                            SETTINGS
                        </span>
                    </motion.button>
                </div>
            </div>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};
