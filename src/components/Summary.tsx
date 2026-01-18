import { useRef, useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import html2canvas from 'html2canvas';

// Helper to lookup item icon
import { levels } from '../data/levels';
import { Scene } from './Game/Scene';
import type { Scene as SceneType } from '../types';

export const Summary = () => {
    const { resetGame, levelProgress, activeOutcomes } = useGameStore();
    const captureRef = useRef<HTMLDivElement>(null); // Ref for capturing the scene area
    const [isSharing, setIsSharing] = useState(false);

    const level4Id = 'level-4';
    const scene1Id = 'scene-4-1';

    // Get Level 4 Data
    const level4 = levels.find(l => l.id === level4Id);
    if (!level4) return <div>Error: Level 4 not found</div>;

    const level4Items = level4.availableItems;

    // -------------------------------------------------------------------------
    // 1. RECONSTRUCT SCENE 1 (High Fidelity)
    // -------------------------------------------------------------------------
    const reconstructedScene1 = useMemo(() => {
        const originalScene1 = level4.scenes.find(s => s.id === scene1Id);
        if (!originalScene1) return null;

        const progress = levelProgress[level4Id];
        // Create a deep copy to avoid mutating the original levels data
        const sceneClone: SceneType = JSON.parse(JSON.stringify(originalScene1));

        // Apply placements
        if (progress && progress.placements) {
            sceneClone.slots = sceneClone.slots.map(slot => ({
                ...slot,
                placedItemId: progress.placements[slot.id] || null
            }));
        }

        return sceneClone;
    }, [level4, levelProgress]);


    // -------------------------------------------------------------------------
    // 2. CONSTRUCT SCENE 2 (Developer Configured Static Scene)
    // -------------------------------------------------------------------------

    // Determine the outcome type based on Scene 1's resolved outcome
    const outcomeType = useMemo(() => {
        if (activeOutcomes[scene1Id]) {
            const id = activeOutcomes[scene1Id]?.id;
            if (id?.includes('scholar')) return 'scholar';
            if (id?.includes('workforce')) return 'workforce';
            if (id?.includes('celebration')) return 'celebration';
        }
        return 'scholar'; // Fallback
    }, [activeOutcomes]);

    const staticSceneInfo = useMemo(() => {
        let slots: any[] = [];
        let bgTitle = "";
        let bgImage = "/assets/scene4_outcome_placeholder.png";

        if (outcomeType === 'scholar') {
            bgTitle = "YOU TRAVELED BACK TO THE PRESENT";
            slots = [
                // Scholar Layout: You Left, Open Center, Book Right
                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: 360, y: 300, scale: 2 },
            ];
        } else if (outcomeType === 'workforce') {
            bgTitle = "YOU JOINED THE CITY’S WORKFORCE";
            slots = [
                // Workforce Layout: You Left, Work Center, Citizens Right
                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: 200, y: 420, scale: 2 },
                { id: 'slot-4-2-2', allowedTypes: ['action'], placedItemId: 'work', shape: 'rectangle' as const, x: 400, y: 300, scale: 2 },
                { id: 'slot-4-2-3', allowedTypes: ['character'], placedItemId: 'group_citizens', shape: 'ellipse' as const, x: 600, y: 420, scale: 2 },
            ];
        } else if (outcomeType === 'celebration') {
            bgTitle = "YOU DANCED TO CHEER THE WORKFORCE";
            slots = [
                // Celebration Layout: You Left, Dance Center, Citizens Right
                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: 200, y: 420, scale: 2 },
                { id: 'slot-4-2-2', allowedTypes: ['action'], placedItemId: 'dance', shape: 'rectangle' as const, x: 400, y: 300, scale: 2 },
                { id: 'slot-4-2-3', allowedTypes: ['character'], placedItemId: 'group_citizens', shape: 'ellipse' as const, x: 600, y: 420, scale: 2 },
            ];
        }

        return {
            scene: {
                id: 'outcome-scene-static',
                slots,
                backgroundImage: bgImage,
                outcomes: [],
            } as SceneType,
            title: bgTitle
        };

    }, [outcomeType]);

    const { scene: staticScene2, title: bgTitle } = staticSceneInfo;

    const [shareImage, setShareImage] = useState<string | null>(null);

    const handleShare = async () => {
        // Capture the entire main content area (Top + Middle + Footer)
        if (!captureRef.current) return;

        try {
            setIsSharing(true);

            // 1. Capture FULL element first (High Res)
            const fullCanvas = await html2canvas(captureRef.current, {
                scale: 3,
                backgroundColor: '#f5e6d3',
                logging: false,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                onclone: (clonedDoc) => {
                    const sponsorRow = clonedDoc.getElementById('sponsorship-row');
                    if (sponsorRow) {
                        sponsorRow.classList.remove('hidden');
                        sponsorRow.style.display = 'flex';
                        sponsorRow.style.paddingBottom = '20px';
                    }

                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach((el: any) => {
                        el.style.animation = 'none';
                        el.style.transition = 'none';
                    });
                }
            });

            // 2. Perform Centered Crop (Post-Process)
            // We want a 16:9 Aspect Ratio based on the HEIGHT of the capture
            // (or Width, whichever allows it to fit, but User logic was Height-based)
            const sourceW = fullCanvas.width;
            const sourceH = fullCanvas.height;

            // User requested 16:9.
            // Let's ensure we find the largest 16:9 area that fits, OR strict height-based?
            // User code: targetWidth = targetHeight * (16 / 9). 
            // This assumes landscape phone (Height is limiting factor, Width > Height * 1.77 is not guaranteed).
            // Actually, usually Phone Width > Height * 16/9 is FALSE. Phone is wide (19.5:9), 16:9 is narrower.
            // So Height-based calculation is usually safe for "cutting sides".
            // BUT, if on iPad (4:3), Height-based 16:9 is WIDER than screen.

            const targetRatio = 16 / 9;
            let finalW, finalH;

            // Strategy: Cover / Zoom-to-fill reasoning?
            // If Source is wider than TargetRatio -> Height matches, Cut Width (Cinematic bars / Side Crop)
            // If Source is taller than TargetRatio -> Width matches, Cut Height
            // But User wants "Cut the side". This implies Source IS Wider.

            // Let's stick to User's logic: Height is the anchor.
            finalH = sourceH;
            finalW = sourceH * targetRatio;

            // Create final canvas
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = finalW;
            finalCanvas.height = finalH;
            const ctx = finalCanvas.getContext('2d');
            if (!ctx) throw new Error("No 2d context");

            // Fill background just in case
            ctx.fillStyle = '#f5e6d3';
            ctx.fillRect(0, 0, finalW, finalH);

            // Draw Centered
            // sourceX = (sourceW - finalW) / 2
            const sourceX = (sourceW - finalW) / 2;
            const sourceY = 0; // We touch top/bottom if finalH == sourceH

            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            ctx.drawImage(
                fullCanvas,
                sourceX, sourceY, finalW, finalH, // Source Crop
                0, 0, finalW, finalH              // Dest
            );

            // 3. Generate Blob from Final Canvas
            const imageBlob = await new Promise<Blob | null>(resolve =>
                finalCanvas.toBlob(blob => resolve(blob), 'image/png')
            );

            if (!imageBlob) throw new Error("Failed to generate image");

            const file = new File([imageBlob], 'lakorn-story.png', { type: 'image/png' });
            const shareData = {
                title: 'Wonderful Story',
                text: 'You’ve connected the pieces. But one truth remains untold.',
                files: [file],
            };

            // Attempt Native Share (System Sheet)
            // We prioritize this for iOS/Android to get the "Share to IG/Save Image" menu
            if (navigator.share) {
                try {
                    // We skip strict canShare checks to treat navigator.share as the source of truth
                    // If this fails, the catch block will handle it.
                    await navigator.share(shareData);
                } catch (shareError: any) {
                    // Only alert if it's not a user cancellation
                    if (shareError.name !== 'AbortError') {
                        console.error("Share failed:", shareError);
                        alert(`Unable to share: ${shareError.message}`);
                    }
                }
                setIsSharing(false);
                return; // STOP HERE. Do not fallback to download if share was attempted.
            }

            // Fallback: Show Manual Save Modal (e.g. for Desktop or when Native Share is missing)
            // We do NOT auto-download to prevent "unwanted saves" on mobile.
            const imageUrl = URL.createObjectURL(imageBlob);
            setShareImage(imageUrl);
            setIsSharing(false);

        } catch (error) {
            console.error("Error generating share image:", error);
            alert("Could not create image.");
        } finally {
            // setIsSharing(false); // Moved to specific success/failure paths
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden hidden landscape:flex flex-col h-[100dvh] w-[100dvw] bg-[#f5e6d3] safe-padding font-serif text-[#2c1810]">

            {/* Portrait Warning Overlay */}
            <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center landscape:hidden w-screen h-screen">
                <div className="text-6xl mb-4 animate-pulse">↻</div>
                <h2 className="text-3xl font-serif mb-2">Please Rotate Device</h2>
                <p className="text-slate-300 font-serif">The story unfolds in landscape mode.</p>
            </div>

            {/* CAPTURE AREA (Top 80%) */}
            <div ref={captureRef} className="flex-1 flex flex-col w-full relative overflow-hidden"
                style={{ backgroundColor: '#f5e6d3' }}>

                {/* Background Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply bg-[url('/assets/parchment-texture.png')] bg-cover" />

                {/* 1. Header: WONDERFUL STORY */}
                <div className="flex-none h-[12%] w-full flex items-center pb-2 justify-center text-center relative z-10">
                    <h1 className="leading-none uppercase tracking-widest drop-shadow-sm"
                        style={{ fontFamily: 'serif', fontSize: 'clamp(1.5rem, 6vh, 3rem)', color: '#2c1810' }}>
                        WONDERFUL STORY
                    </h1>
                </div>

                {/* 2. Scenes Area */}
                <div className="flex-1 min-h-0 w-full flex items-center justify-center pt-2 relative z-10">
                    <div className="h-full flex flex-nowrap gap-4 md:gap-8 items-center justify-center">

                        {/* Scene 1 */}
                        {reconstructedScene1 && (
                            <div className="h-full aspect-[4/3] w-auto max-w-[32vw] relative">
                                <Scene
                                    scene={reconstructedScene1}
                                    isActive={false}
                                    levelItems={level4Items}
                                    overrideTitle={activeOutcomes[scene1Id]?.title}
                                />
                            </div>
                        )}

                        {/* Scene 2 */}
                        {staticScene2 && (
                            <div className="h-full aspect-[4/3] w-auto max-w-[32vw] relative">
                                <Scene
                                    scene={staticScene2}
                                    isActive={false}
                                    levelItems={level4Items}
                                    overrideTitle={bgTitle}
                                />
                            </div>
                        )}

                    </div>
                </div>

                {/* 3. Footer: Quote & Brand */}
                <div className="flex-none h-[45%] w-full flex flex-col items-center justify-center pt-5 relative z-10">
                    {/* Divider Line */}
                    <div className="w-[60%] h-px mt-[10px] mb-[5px] flex items-center justify-center" style={{ backgroundColor: 'rgba(44, 24, 16, 0.3)' }}>
                        <div className="w-[5px] h-[5px]" style={{ backgroundColor: '#2c1810', transform: 'rotate(45deg)' }} />
                    </div>

                    <div className="flex flex-col items-center gap-1 text-center opacity-90 px-4 mb-3">
                        <p className="uppercase tracking-widest font-bold text-[clamp(0.6rem,2vh,1rem)]" style={{ color: '#2c1810' }}>
                            “You’ve connected the pieces.
                        </p>
                        <p className="uppercase tracking-widest font-bold text-[clamp(0.6rem,2vh,1rem)]" style={{ color: '#2c1810' }}>
                            But one truth remains untold.
                        </p>
                        <p className="uppercase tracking-widest mt-1 text-[clamp(0.55rem,1.8vh,0.9rem)]" style={{ color: 'rgba(44, 24, 16, 0.7)' }}>
                            Discover the final chapter — Only at <span className="font-black" style={{ color: '#8d2a2a' }}>LAKORNVIDVA</span>”
                        </p>
                    </div>

                    {/* Sponsorship Logos (Bottom Center) */}
                    {/* Hidden in UI, Visible in Share via onclone */}
                    <div id="sponsorship-row" className="hidden items-center justify-center gap-6 opacity-80 mt-auto mb-4">
                        <div className="h-8 md:h-12 w-auto aspect-video flex items-center justify-center border rounded-sm"
                            style={{ backgroundColor: 'rgba(44, 24, 16, 0.1)', borderColor: 'rgba(44, 24, 16, 0.2)' }}>
                            <span className="text-[0.5rem] md:text-xs uppercase px-2 font-bold" style={{ color: 'rgba(44, 24, 16, 0.5)' }}>Sponsor 1</span>
                        </div>
                        <div className="h-8 md:h-12 w-auto aspect-video flex items-center justify-center border rounded-sm"
                            style={{ backgroundColor: 'rgba(44, 24, 16, 0.1)', borderColor: 'rgba(44, 24, 16, 0.2)' }}>
                            <span className="text-[0.5rem] md:text-xs uppercase px-2 font-bold" style={{ color: 'rgba(44, 24, 16, 0.5)' }}>Sponsor 2</span>
                        </div>
                        <div className="h-8 md:h-12 w-auto aspect-video flex items-center justify-center border rounded-sm"
                            style={{ backgroundColor: 'rgba(44, 24, 16, 0.1)', borderColor: 'rgba(44, 24, 16, 0.2)' }}>
                            <span className="text-[0.5rem] md:text-xs uppercase px-2 font-bold" style={{ color: 'rgba(44, 24, 16, 0.5)' }}>Sponsor 3</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* ACTION BUTTONS (Bottom 15% - Outside Capture) */}
            <div className="flex-none h-[15%] w-full relative flex items-center justify-center bg-[#2c1810]/10 border-t border-[#2c1810]/10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="bg-[#2c1810] hover:bg-[#4a2c2a] text-[#f5e6d3] font-serif-bold px-6 py-2 rounded-sm shadow-lg flex items-center gap-2 transition-all uppercase tracking-wider transform hover:scale-105 disabled:opacity-50"
                    >
                        {isSharing ? 'Saving...' : 'Share Story'}
                    </button>

                    <button
                        onClick={() => {
                            resetGame();
                            window.location.href = "/";
                        }}
                        className="bg-transparent border-2 border-[#2c1810] text-[#2c1810] hover:bg-[#2c1810]/5 font-serif-bold px-6 py-2 rounded-sm transition-all uppercase tracking-wider transform hover:scale-105"
                    >
                        Replay
                    </button>

                    <a
                        href="https://ticketmelon.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-amber-700 hover:bg-amber-800 text-white font-serif-bold px-6 py-2 rounded-sm shadow-lg transition-all uppercase tracking-wider transform hover:scale-105"
                    >
                        Buy Ticket
                    </a>
                </div>
            </div>


            {/* Share Preview Modal (Fallback) */}
            {shareImage && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-8 backdrop-blur-sm animate-fade-in"
                    onClick={() => setShareImage(null)}>

                    <div className="relative max-w-[80vw] max-h-[80vh] flex flex-col items-center gap-4"
                        onClick={e => e.stopPropagation()}>

                        <div className="bg-white p-2 rounded shadow-2xl">
                            <img src={shareImage} alt="Your Story" className="max-w-full max-h-[60vh] object-contain" />
                        </div>

                        <div className="flex flex-col items-center gap-2 text-white">
                            <p className="font-serif text-lg text-center animate-pulse">
                                Image Ready! Long press to Share.
                            </p>
                            <button
                                onClick={() => setShareImage(null)}
                                className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-bold uppercase tracking-widest transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
