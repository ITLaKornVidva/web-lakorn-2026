import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';


const CHARACTERS = [
    { id: 'player1', name: 'Adventurer' },
    { id: 'player2', name: 'Scholar' },
    { id: 'player3', name: 'Artist' },
];

export const CharacterSelectionPage = () => {
    const navigate = useNavigate();
    const { setCharacterId, setPlayerName, playerName: savedName, characterId: savedCharId } = useGameStore();


    // Determine initial index based on savedCharId
    const initialIndex = CHARACTERS.findIndex(c => c.id === savedCharId);
    const [selectedIndex, setSelectedIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
    const [name, setName] = useState(savedName || '');

    const handleNext = () => {

        setSelectedIndex((prev) => (prev + 1) % CHARACTERS.length);
    };

    const handlePrev = () => {

        setSelectedIndex((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
    };

    const handleCharacterClick = (index: number) => {
        if (index === selectedIndex) return;

        setSelectedIndex(index);
    };

    const handleConfirm = () => {
        if (!name.trim()) {
            alert("Please enter your name!");
            return;
        }


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
        <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center font-serif">
            {/* Background Texture Removed */}

            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center px-4 h-full py-2 md:py-4">

                {/* Title - Fixed Height, doesn't shrink */}
                <h1 className="text-2xl md:text-5xl font-serif-bold text-[#2c1810] mb-2 md:mb-8 uppercase tracking-widest text-center shrink-0">
                    Select Your Character
                </h1>

                {/* Main Content Area - Split Layout
                    Using flex-1 and min-h-0 is CRITICAL for flexbox nesting to work correctly
                    and prevent overflow on Safari. It forces this container to take ONLY the remaining space.
                */}
                <div className="flex flex-row items-center justify-center w-full gap-4 md:gap-12 lg:gap-20 flex-1 min-h-0">

                    {/* Left Side: Character Carousel */}
                    <div className="relative h-full w-[45%] md:w-[500px] flex items-center justify-center perspective-1000">

                        {/* ================= VISUAL LAYER (Low Z-Index) ================= */}
                        {/* Previous Character Visual */}
                        <div className="absolute left-[-10px] md:left-0 opacity-40 scale-50 md:scale-75 blur-[1px] transition-all z-10 p-4 pointer-events-none">
                            <img
                                src={`/assets/characters/${CHARACTERS[prevIndex].id}_idle.png`}
                                alt="Previous"
                                className="h-32 md:h-64 object-contain drop-shadow-md grayscale"
                            />
                        </div>

                        {/* Next Character Visual */}
                        <div className="absolute right-[-10px] md:right-0 opacity-40 scale-50 md:scale-75 blur-[1px] transition-all z-10 p-4 pointer-events-none">
                            <img
                                src={`/assets/characters/${CHARACTERS[nextIndex].id}_idle.png`}
                                alt="Next"
                                className="h-32 md:h-64 object-contain drop-shadow-md grayscale"
                            />
                        </div>

                        {/* ================= CENTER LAYER (Medium Z-Index) ================= */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedIndex}
                                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="relative z-20 cursor-grab active:cursor-grabbing h-full flex items-center justify-center"
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
                                <div className="relative flex justify-center items-center h-full w-full">
                                    {/* Character Glow/Spotlight */}
                                    <div className="absolute inset-0 bg-amber-200/30 blur-3xl rounded-full scale-110 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]"></div>

                                    {/* Image set to h-full max-h-full to respect parental bounds fully */}
                                    <img
                                        src={`/assets/characters/${CHARACTERS[selectedIndex].id}_idle.png`}
                                        alt={CHARACTERS[selectedIndex].name}
                                        className="h-full max-h-full w-auto object-contain drop-shadow-2xl relative z-10"
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* ================= INTERACTION LAYER (High Z-Index) ================= */}
                        {/* These are invisible but sit on top of everything to capture clicks in overlapping areas */}

                        {/* Previous Click Target */}
                        <div
                            className="absolute left-[-10px] md:left-0 opacity-0 scale-50 md:scale-75 cursor-pointer z-30 p-4 h-32 md:h-64 flex items-center"
                            onClick={() => handleCharacterClick(prevIndex)}
                        >
                            <img
                                src={`/assets/characters/${CHARACTERS[prevIndex].id}_idle.png`}
                                alt="Previous Action"
                                className="h-full object-contain"
                            />
                        </div>

                        {/* Next Click Target */}
                        <div
                            className="absolute right-[-10px] md:right-0 opacity-0 scale-50 md:scale-75 cursor-pointer z-30 p-4 h-32 md:h-64 flex items-center"
                            onClick={() => handleCharacterClick(nextIndex)}
                        >
                            <img
                                src={`/assets/characters/${CHARACTERS[nextIndex].id}_idle.png`}
                                alt="Next Action"
                                className="h-full object-contain"
                            />
                        </div>


                        {/* Mobile Indicators (Dots) - now below the character within the left side */}
                        <div className="absolute bottom-0 flex gap-3 md:hidden z-30 translate-y-2">
                            {CHARACTERS.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full ${idx === selectedIndex ? 'bg-[#5C4033]' : 'bg-[#D2B48C]'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Name Input Section */}
                    {/* Centered vertically within the flex-1 space */}
                    <div className="w-[45%] md:w-96 flex flex-col items-center md:items-start gap-3 md:gap-4 z-20 justify-center">
                        <div className="w-full relative">
                            <label className="block text-center md:text-left text-[#5C4033] font-serif-bold tracking-widest text-xs md:text-sm mb-1 uppercase">
                                Please Enter Your Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name..."
                                maxLength={15}
                                className="w-full bg-[#fdf6e3] text-[#2c1810] text-center md:text-left font-serif text-base md:text-2xl py-2 px-3 md:px-4 border-b-2 border-[#5C4033] focus:outline-none focus:border-[#8B5A2B] placeholder:text-[#2c1810]/30 transition-colors rounded-t-sm"
                            />
                        </div>

                        <div className="text-center md:text-left text-[#5C4033] text-sm md:text-base font-serif italic opacity-80 mb-1">
                            I am... <span className="font-serif-bold not-italic">{CHARACTERS[selectedIndex].name}</span>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={!name.trim()}
                            className="px-6 py-3 md:px-12 md:py-4 bg-[#5C4033] text-[#D2B48C] font-serif-bold text-sm md:text-xl uppercase tracking-widest rounded-sm shadow-lg hover:shadow-xl hover:bg-[#4a332a] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#3e2b22] w-full cursor-pointer"
                        >
                            Start Journey
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};
