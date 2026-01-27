import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsModal } from './UI/SettingsModal';
import { useSfx } from './UI/AudioController';

export const LobbyPage = () => {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { playSfx } = useSfx();

    const handlePlay = () => {
        playSfx('/assets/sfx/click.mp3'); // Placeholder path, logic handles if missing
        navigate('/character-select');
    };

    const handleOpenSettings = () => {
        playSfx('/assets/sfx/click.mp3');
        setIsSettingsOpen(true);
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#f5e6d3] flex items-center justify-center overflow-hidden">
            {/* Background Texture/Effect can be added here */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/assets/backgrounds/paper-texture.png')] bg-cover mix-blend-multiply"></div>

            <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
                {/* Title or Logo could go here */}
                <h1 className="text-6xl md:text-8xl font-serif-bold text-[#2c1810] tracking-widest drop-shadow-md mb-8">
                    LA DERNIÈRE
                </h1>

                {/* Main Buttons */}
                <div className="flex flex-col gap-6 w-64 md:w-80">
                    <button
                        onClick={handlePlay}
                        className="group relative px-8 py-4 bg-[#5C4033] text-[#D2B48C] font-serif-bold text-2xl md:text-3xl rounded-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-[#3e2b22]"
                    >
                        <span className="relative z-10">PLAY</span>
                        {/* Decorative corner accents could be added here via CSS or SVG */}
                    </button>

                    <button
                        onClick={handleOpenSettings}
                        className="group relative px-8 py-3 bg-[#8B5A2B] text-[#f5e6d3] font-serif-bold text-xl md:text-2xl rounded-sm shadow-md hover:shadow-lg hover:scale-105 transition-all border-2 border-[#5C4033]"
                    >
                        SETTINGS
                    </button>
                </div>
            </div>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};
