import { useRef, useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import html2canvas from 'html2canvas';
import { DiscountCodeModal } from './DiscountCodeModal';

// Helper to lookup item icon
import { levels } from '../data/levels';
import { Scene } from './Game/Scene';
import type { Scene as SceneType } from '../types';

export const Summary = () => {
    const { resetGame, levelProgress, activeOutcomes, playerName } = useGameStore();
    const captureRef = useRef<HTMLDivElement>(null); // Ref for capturing the scene area
    const [isSharing, setIsSharing] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);

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
        let bgImage: string | string[] = "/assets/scene4_outcome_placeholder.png"; // Support arrays
        let characterStates: Record<string, string> = {};

        if (outcomeType === 'scholar') {
            bgTitle = "You traveled back to the present.";
            bgImage = '/assets/backgrounds/Background-3.png';
            characterStates = { 'you': 'awe' };
            slots = [
                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: 350, y: 420, scale: 3, flipX: true }
            ];
        } else if (outcomeType === 'workforce') {
            bgTitle = "Now you work hard everyday.";
            bgImage = ['/assets/backgrounds/Background.png', '/assets/backgrounds/Background-1.png'];
            characterStates = { 'you': 'work' };
            slots = [
                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: [370, 270], y: [400, 330], scale: [3, 4], flipX: [true, false] },
            ];
        } else if (outcomeType === 'celebration') {
            bgTitle = "Everyone starts dancing with you.";
            bgImage = '/assets/backgrounds/Background.png';
            characterStates = { 'you': 'dance', 'group_citizens': 'dance' };
            slots = [
                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: 160, y: 420, scale: 3, flipX: true },
                { id: 'slot-4-2-2', allowedTypes: ['character'], placedItemId: 'group_citizens', shape: 'ellipse' as const, x: 575, y: 420, scale: 3 },
            ];
        }

        return {
            scene: {
                id: 'outcome-scene-static',
                slots,
                backgroundImage: bgImage,
                outcomes: [],
            } as SceneType,
            title: bgTitle,
            characterStates // Pass this out to override scene
        };

    }, [outcomeType]);

    const { scene: staticScene2, title: bgTitle, characterStates: overrideStates } = staticSceneInfo;

    const [shareImage, setShareImage] = useState<string | null>(null);

    const handleShare = async () => {
        if (!captureRef.current) return;
        if (isSharing) return;

        try {
            setIsSharing(true);

            // 1. Capture FULL element (High Res)
            const fullCanvas = await html2canvas(captureRef.current, {
                scale: 3,
                backgroundColor: '#f5e6d3',
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    const sponsorRow = clonedDoc.getElementById('sponsorship-row');
                    if (sponsorRow) {
                        sponsorRow.classList.remove('hidden');
                        sponsorRow.style.display = 'flex';
                        sponsorRow.style.paddingBottom = '20px';
                    }

                    // Stop animations for static capture
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach((el: any) => {
                        el.style.animation = 'none';
                        el.style.transition = 'none';

                        // SANITIZER: Robustly remove oklab/oklch from ALL color properties
                        const style = window.getComputedStyle(el);
                        const scrubProperty = (prop: string, fallback: string) => {
                            const val = style.getPropertyValue(prop);
                            if (val && (val.includes('oklab') || val.includes('oklch'))) {
                                el.style[prop as any] = fallback;
                            }
                        };

                        // Targeted scrubbing
                        scrubProperty('box-shadow', 'none');
                        scrubProperty('text-shadow', 'none');
                        scrubProperty('filter', 'none'); // drop-shadow often lives here
                        scrubProperty('color', '#000000'); // Fallback text to black
                        scrubProperty('background-color', 'transparent'); // Fallback bg to transparent
                        scrubProperty('border-color', 'transparent');
                    });

                    // FIX: Enforce centering for Action Items using ABSOLUTE POSITIONING (Geometric centering)
                    const actionItems = clonedDoc.querySelectorAll('.action-item-container');
                    actionItems.forEach((el: any) => {
                        el.style.position = 'relative';
                        el.style.display = 'inline-block';
                        // Clear padding that might affect height calculation
                        el.style.padding = '0';
                        el.style.width = '64px'; // Enforce width/height if needed, but let's try dynamic
                        el.style.height = '24px'; // Approximate height from padding
                    });

                    const actionTexts = clonedDoc.querySelectorAll('.action-item-text');
                    actionTexts.forEach((el: any) => {
                        el.style.display = 'flex';
                        el.style.alignItems = 'center';
                        el.style.justifyContent = 'center';
                        el.style.whiteSpace = 'nowrap';
                        el.style.padding = '0';
                        el.style.margin = '0';
                        el.style.lineHeight = '1';
                    });

                    // FIX: Scene Titles Alignment
                    const sceneTitles = clonedDoc.querySelectorAll('.scene-title');
                    sceneTitles.forEach((el: any) => {
                        el.style.display = 'flex';
                        el.style.alignItems = 'center';
                        el.style.justifyContent = 'center';
                        el.style.lineHeight = '1';
                        // Manual tweak for font baseline if needed
                        el.style.paddingBottom = '25px';
                        el.style.paddingInline = '50px';
                    });
                }
            });

            // 2. Perform Centered Crop (16:9)
            const sourceW = fullCanvas.width;
            const sourceH = fullCanvas.height;
            const targetRatio = 16 / 9;
            const finalH = sourceH;
            const finalW = sourceH * targetRatio;

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = finalW;
            finalCanvas.height = finalH;
            const ctx = finalCanvas.getContext('2d');

            if (ctx) {
                ctx.fillStyle = '#f5e6d3';
                ctx.fillRect(0, 0, finalW, finalH);

                const sourceX = (sourceW - finalW) / 2;
                ctx.drawImage(fullCanvas, sourceX, 0, finalW, finalH, 0, 0, finalW, finalH);
            }

            // 3. Generate Image
            const imageBlob = await new Promise<Blob | null>(resolve =>
                finalCanvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9)
            );

            if (!imageBlob) throw new Error("Failed to generate image");

            const file = new File([imageBlob], 'lakorn-story.jpg', { type: 'image/jpeg' });

            if (navigator.share) {
                try {
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            title: 'Wonderful Story',
                            text: 'My Lakorn Story Ending...',
                            files: [file]
                        });
                        setIsSharing(false);
                        return;
                    }
                } catch (err) {
                    console.warn("Share failed, falling back", err);
                }
            }

            // Fallback
            const url = URL.createObjectURL(imageBlob);
            setShareImage(url);
            setIsSharing(false);

        } catch (error) {
            console.error("Error generating image:", error);
            alert("Could not create image.");
            setIsSharing(false);
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
                <div className="flex-none h-[12%] w-full flex flex-col items-center pb-2 justify-center text-center relative z-10">
                    <h1 className="leading-none uppercase tracking-widest"
                        style={{ fontFamily: 'serif', fontSize: 'clamp(1.5rem, 6vh, 3rem)', color: '#2c1810', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                        WONDERFUL STORY
                    </h1>
                    {playerName && (
                        <p className="text-[#5C4033] font-serif-bold tracking-[0.2em] uppercase text-[clamp(0.8rem,2vh,1.2rem)] mt-1 animate-fade-in">
                            — {playerName} —
                        </p>
                    )}
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
                                    overrideCharacterStates={overrideStates}
                                />
                            </div>
                        )}

                    </div>
                </div>

                {/* 3. Footer: Quote & Brand */}
                <div className="flex-none h-[45%] w-full flex flex-col items-center justify-center pt-5 relative z-10">
                    {/* Divider Line */}
                    <div className="w-[50%] h-px mt-[20px] mb-[4px] flex items-center justify-center" style={{ backgroundColor: 'rgba(44, 24, 16, 0.3)' }}>
                        <div className="w-[5px] h-[5px]" style={{ backgroundColor: '#2c1810', transform: 'rotate(45deg)' }} />
                    </div>

                    <div className="flex flex-col items-center gap-1 text-center opacity-90 px-4 mb-3">
                        <p className="uppercase tracking-widest font-bold text-[clamp(0.4rem,1.5vh,0.8rem)]" style={{ color: '#2c1810' }}>
                            “You’ve connected the pieces.
                        </p>
                        <p className="uppercase tracking-widest font-bold text-[clamp(0.4rem,1.5vh,0.8rem)]" style={{ color: '#2c1810' }}>
                            But one truth remains untold.
                        </p>
                        <p className="uppercase tracking-widest mt-1 text-[clamp(0.4rem,1.5vh,0.8rem)]" style={{ color: 'rgba(44, 24, 16, 0.7)' }}>
                            Discover the final chapter — Only at <span className="font-black" style={{ color: '#8d2a2a' }}>LAKORNVIDVA</span>”
                        </p>
                    </div>

                    {/* Sponsorship Logos (Bottom Center) */}
                    {/* Hidden in UI, Visible in Share via onclone */}
                    {/* Sponsorship Logos (Bottom Center) */}
                    {/* Hidden in UI, Visible in Share via onclone */}
                    <div id="sponsorship-row" className="hidden flex-col items-center justify-center gap-2 opacity-80 mt-auto mb-4">
                        <span className="text-[0.4rem] uppercase font-bold tracking-[0.2em]" style={{ color: 'rgba(44, 24, 16, 0.5)' }}>Sponsored By</span>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-6 w-6 flex items-center justify-center border rounded-[9999px]"
                                style={{ backgroundColor: 'rgba(44, 24, 16, 0.1)', borderColor: 'rgba(44, 24, 16, 0.2)' }}>
                            </div>
                            <div className="h-6 w-6 flex items-center justify-center border rounded-[9999px]"
                                style={{ backgroundColor: 'rgba(44, 24, 16, 0.1)', borderColor: 'rgba(44, 24, 16, 0.2)' }}>
                            </div>
                            <div className="h-6 w-6 flex items-center justify-center border rounded-[9999px]"
                                style={{ backgroundColor: 'rgba(44, 24, 16, 0.1)', borderColor: 'rgba(44, 24, 16, 0.2)' }}>
                            </div>
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
                        className="bg-[#2c1810] hover:bg-[#4a2c2a] text-[#f5e6d3] font-serif-bold px-6 py-2 rounded-sm shadow-lg flex items-center gap-2 transition-all uppercase tracking-wider transform hover:scale-105 disabled:opacity-50 cursor-pointer"
                    >
                        {isSharing ? 'Saving...' : 'Share Story'}
                    </button>

                    <button
                        onClick={() => {
                            resetGame();
                            window.location.href = "/";
                        }}
                        className="bg-transparent border-2 border-[#2c1810] text-[#2c1810] hover:bg-[#2c1810]/5 font-serif-bold px-6 py-2 rounded-sm transition-all uppercase tracking-wider transform hover:scale-105 cursor-pointer"
                    >
                        Replay
                    </button>

                    <button
                        onClick={() => setShowDiscountModal(true)}
                        className="bg-amber-700 hover:bg-amber-800 text-white font-serif-bold px-6 py-2 rounded-sm shadow-lg transition-all uppercase tracking-wider transform hover:scale-105 cursor-pointer"
                    >
                        Buy Ticket
                    </button>
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
                                className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-bold uppercase tracking-widest transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DiscountCodeModal
                isOpen={showDiscountModal}
                onClose={() => setShowDiscountModal(false)}
                onProceed={() => setShowDiscountModal(false)}
            />
        </div>
    );
};
