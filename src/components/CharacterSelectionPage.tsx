import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSfx } from './UI/AudioController';

const CHARACTERS = [
    { id: 'player1', name: 'Adventurer' },
    { id: 'player2', name: 'Scholar' },
    { id: 'player3', name: 'Artist' },
];

export const CharacterSelectionPage = () => {
    const navigate = useNavigate();
    const { setCharacterId, setPlayerName, playerName: savedName, characterId: savedCharId } = useGameStore();
    const { playSfx } = useSfx();

    // Determine initial index based on savedCharId
    const initialIndex = CHARACTERS.findIndex(c => c.id === savedCharId);
    const [selectedIndex, setSelectedIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
    const [name, setName] = useState(savedName || '');

    const handleNext = () => {
        playSfx('/assets/sfx/paper-flip.mp3');
        setSelectedIndex((prev) => (prev + 1) % CHARACTERS.length);
    };

    const handlePrev = () => {
        playSfx('/assets/sfx/paper-flip.mp3');
        setSelectedIndex((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
    };

    const handleCharacterClick = (index: number) => {
        if (index === selectedIndex) return;
        playSfx('/assets/sfx/paper-flip.mp3');
        setSelectedIndex(index);
    };

    const handleConfirm = () => {
        if (!name.trim()) {
            alert("Please enter your name!");
            return;
        }
        playSfx('/assets/sfx/success.mp3');

        // Save to store (Logic handles persistence automatically via zustand persist)
        setCharacterId(CHARACTERS[selectedIndex].id);
        setPlayerName(name);

        // Navigate to Level Select (The Map)
        navigate('/level-select');
    };

    // Calculate indices for circular carousel
    const prevIndex = (selectedIndex - 1 + CHARACTERS.length) % CHARACTERS.length;
    const nextIndex = (selectedIndex + 1) % CHARACTERS.length;

    return (
        <div className="fixed inset-0 w-full h-full bg-[#f5e6d3] overflow-hidden flex flex-col items-center justify-center font-serif">
            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/assets/backgrounds/paper-texture.png')] bg-cover mix-blend-multiply"></div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center px-4">

                <h1 className="text-3xl md:text-5xl font-serif-bold text-[#2c1810] mb-2 uppercase tracking-widest text-center">
                    Select Your Character
                </h1>

                {/* Carousel Container */}
                <div className="relative h-[400px] w-full flex items-center justify-center perspective-1000 mb-8">

                    {/* Previous Character (Left) */}
                    <div
                        className="absolute left-4 md:left-20 opacity-50 scale-75 cursor-pointer blur-[1px] hover:opacity-70 transition-all z-0 hidden md:block"
                        onClick={() => handleCharacterClick(prevIndex)}
                    >
                        <img
                            src={`/assets/characters/${CHARACTERS[prevIndex].id}_idle.png`}
                            alt="Previous"
                            className="h-64 object-contain drop-shadow-md grayscale"
                        />
                    </div>

                    {/* Next Character (Right) */}
                    <div
                        className="absolute right-4 md:right-20 opacity-50 scale-75 cursor-pointer blur-[1px] hover:opacity-70 transition-all z-0 hidden md:block"
                        onClick={() => handleCharacterClick(nextIndex)}
                    >
                        <img
                            src={`/assets/characters/${CHARACTERS[nextIndex].id}_idle.png`}
                            alt="Next"
                            className="h-64 object-contain drop-shadow-md grayscale"
                        />
                    </div>

                    {/* Active Character (Center) */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative z-10 cursor-grab active:cursor-grabbing"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, { offset }) => {
                                const swipe = offset.x; // + right, - left
                                if (swipe < -50) {
                                    handleNext();
                                } else if (swipe > 50) {
                                    handlePrev();
                                }
                            }}
                        >
                            <div className="relative">
                                {/* Character Glow/Spotlight */}
                                <div className="absolute inset-0 bg-amber-200/30 blur-3xl rounded-full scale-110"></div>

                                <img
                                    src={`/assets/characters/${CHARACTERS[selectedIndex].id}_idle.png`}
                                    alt={CHARACTERS[selectedIndex].name}
                                    className="h-[300px] md:h-[400px] object-contain drop-shadow-2xl relative z-10"
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Mobile Indicators (Dots) */}
                    <div className="absolute -bottom-8 flex gap-3 md:hidden">
                        {CHARACTERS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-3 h-3 rounded-full ${idx === selectedIndex ? 'bg-[#5C4033]' : 'bg-[#D2B48C]'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Name Input Section */}
                <div className="w-full max-w-md flex flex-col items-center gap-6 mt-4">
                    <div className="w-full relative">
                        <label className="block text-center text-[#5C4033] font-serif-bold tracking-widest text-sm mb-2 uppercase">
                            Please Enter Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name..."
                            maxLength={15}
                            className="w-full bg-[#fdf6e3] text-[#2c1810] text-center font-serif text-2xl py-3 border-b-2 border-[#5C4033] focus:outline-none focus:border-[#8B5A2B] placeholder:text-[#2c1810]/30 transition-colors rounded-t-sm"
                        />
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!name.trim()}
                        className="px-12 py-4 bg-[#5C4033] text-[#D2B48C] font-serif-bold text-xl uppercase tracking-widest rounded-sm shadow-lg hover:shadow-xl hover:bg-[#4a332a] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#3e2b22] w-full"
                    >
                        Start Journey
                    </button>
                </div>

            </div>
        </div>
    );
};
