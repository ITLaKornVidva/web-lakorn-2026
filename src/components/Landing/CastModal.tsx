import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Cast {
    id: number;
    name: string;
    role: string;
    image: string;
    cardImage: string;
    message: string;
    imageConfig?: {
        offset?: { x: number; y: number };
        scale?: number;
        rotate?: number;
    };
}

interface CastModalProps {
    cast: Cast | null;
    onClose: () => void;
}

export function CastModal({ cast, onClose }: CastModalProps) {
    const [isMessageRevealed, setIsMessageRevealed] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (cast) {
            window.addEventListener('keydown', handleKeyDown);
            // Reset state when opening a new cast
            setIsMessageRevealed(false);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cast, onClose]);

    const handleCardClick = () => {
        if (isMessageRevealed) {
            // Toggle back to info state when message is clicked
            setIsMessageRevealed(false);
        } else {
            // Reveal message
            setIsMessageRevealed(true);
        }
    };

    return (
        <AnimatePresence>
            {cast && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
                        onClick={onClose}
                    />

                    {/* Close Button ("X") - Screen Top Right */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="fixed top-8 right-8 md:top-12 md:right-12 text-white/50 hover:text-white bg-black/30 hover:bg-black/80 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all z-[120] border border-white/10"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[#E2C37B]/20 bg-[#1A1A1A] cursor-pointer"
                        onClick={handleCardClick}
                    >
                        {/* State 1: Card Graphic */}
                        <div className="absolute inset-0 w-full h-full">
                            {cast.cardImage ? (
                                <img src={cast.cardImage} alt={`${cast.name} Card`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#2a303b] flex items-center justify-center">
                                    <span className="text-xl text-white/50">Missing Card</span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Full Page Message Overlay (State 2) */}
                    <AnimatePresence>
                        {isMessageRevealed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-8 text-center bg-black/80 backdrop-blur-md cursor-pointer px-10"
                                onClick={() => setIsMessageRevealed(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="max-w-3xl"
                                >
                                    <p className="text-white font-sketchy text-2xl md:text-4xl leading-relaxed italic border-x-2 border-[#F2C94C] px-10 py-6 bg-black/40 rounded-sm tracking-[0.05em]">
                                        {cast.message}
                                    </p>
                                    <p className="text-[#F2C94C] font-serif-bold mt-10 text-xl tracking-[0.2em] uppercase">— {cast.name} —</p>

                                    <p className="text-white/40 text-sm mt-12 tracking-widest uppercase animate-pulse">
                                        Click anywhere to return
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    );
}
