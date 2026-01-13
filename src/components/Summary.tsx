import { useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { EndingCard } from './EndingCard';
import html2canvas from 'html2canvas';

export const Summary = () => {
    const { userName, userAvatar, resetGame } = useGameStore();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        if (!cardRef.current) return;

        try {
            setIsSharing(true);
            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // Better quality
                backgroundColor: null,
                logging: false,
            });

            const imageBlob = await new Promise<Blob | null>(resolve =>
                canvas.toBlob(blob => resolve(blob), 'image/png')
            );

            if (!imageBlob) {
                throw new Error("Failed to generate image");
            }

            // Mobile Native Share
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([imageBlob], 'story.png', { type: 'image/png' })] })) {
                const file = new File([imageBlob], 'story-outcome.png', { type: 'image/png' });
                await navigator.share({
                    title: 'My Story Outcome',
                    text: 'I completed the story! Check out my result.',
                    files: [file],
                });
            } else {
                // Fallback: Download
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'story-outcome.png';
                link.click();
            }

        } catch (error) {
            console.error("Error sharing:", error);
            alert("Could not share/download the image. Please try again.");
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf6e3] flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-serif text-slate-800 mb-2">The End</h1>
                <p className="text-slate-600">Your journey has concluded.</p>
            </div>

            {/* This wrapper is what we see */}
            <div className="relative mb-8">
                {/* Visual Card */}
                <EndingCard userName={userName} userAvatar={userAvatar} id="ending-card-visible" />

                {/* Hidden Capture Target (if we wanted a specific clean version for capture, 
                    but here we can typically just capture the visible one or use a hidden one off-screen.
                    Using the visible one provides better feedback to user that 'this' is what is being shared.
                ) */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-0 pointer-events-none">
                    {/* 
                        Logic note: html2canvas works best on visible elements. 
                        We will just target the visible EndingCard using a ref wrapper.
                     */}
                </div>
            </div>

            {/* We attach ref to a wrapper around the card component to ensure we capture specifically that block */}
            <div className="fixed left-[-9999px]" aria-hidden="true">
                <div ref={cardRef}>
                    <EndingCard userName={userName} userAvatar={userAvatar} />
                </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-serif text-lg px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSharing ? 'Generating...' : (
                        <>
                            <span>Share Outcome</span>
                            <span>📸</span>
                        </>
                    )}
                </button>

                <button
                    onClick={resetGame}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-serif text-lg px-8 py-3 rounded-full shadow-md transform hover:scale-105 transition-all"
                >
                    Back to Start
                </button>
            </div>
        </div>
    );
};
