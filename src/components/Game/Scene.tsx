import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { useGameStore } from '../../store/gameStore';
import type { Scene as SceneType, Item } from '../../types';
import { SCENE_BASE_WIDTH, SCENE_BASE_HEIGHT } from '../../types';
import { Slot } from './Slot';

interface SceneProps {
    scene: SceneType;
    isActive: boolean;
    levelItems: Item[];
    overrideTitle?: string;
    hideTitle?: boolean;
    overrideCharacterStates?: Record<string, string>;
    onModalClosed?: () => void;
}

export const Scene = ({ scene, isActive, levelItems, overrideTitle, hideTitle, overrideCharacterStates, onModalClosed }: SceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);

    // Subscribe to active outcomes
    const activeOutcomes = useGameStore(state => state.activeOutcomes);
    const activeOutcome = activeOutcomes[scene.id];

    const displayTitle = hideTitle ? null : (overrideTitle || activeOutcome?.title);

    // Helper to get forced state for an item in this scene
    // Logic: Check override first, then active outcome
    const getForcedState = (itemId: string | undefined) => {
        if (!itemId) return undefined;
        if (overrideCharacterStates && overrideCharacterStates[itemId]) {
            return overrideCharacterStates[itemId];
        }
        if (activeOutcome && activeOutcome.characterStates) {
            return activeOutcome.characterStates[itemId];
        }
        return undefined;
    };

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setScale(width / SCENE_BASE_WIDTH);
            }
        };

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);

        updateScale();
        return () => observer.disconnect();
    }, []);

    const globalFrame = useGameStore(state => state.globalAnimationFrame);

    const getBackgroundImageUrl = () => {
        const bg = scene.backgroundImage;
        if (Array.isArray(bg) && bg.length > 0) {
            return `url(${bg[globalFrame % bg.length]})`;
        }
        return bg ? `url(${bg})` : undefined;
    };

    // Auto-trigger zoom when title appears (scene solved)
    const prevTitleRef = useRef(displayTitle);
    const isFirstMount = useRef(true);

    useEffect(() => {
        // Skip check on initial mount to prevent popup when loading a solved level
        if (isFirstMount.current) {
            isFirstMount.current = false;
            prevTitleRef.current = displayTitle;
            return;
        }

        // If title just appeared (was null/undefined, now is string), trigger zoom
        if (!prevTitleRef.current && displayTitle) {
            setIsZoomed(true);
        }
        prevTitleRef.current = displayTitle;
    }, [displayTitle]);

    return (
        <div
            ref={containerRef}
            className={clsx(
                "overflow-hidden flex flex-col", // Removed shadow-lg to avoid oklab error
                "aspect-[4/3] w-full relative",
                isActive ? "scale-[1.02]" : ""
            )}
            style={{
                backgroundColor: '#ffffff',
                border: '2px solid #2c1810',
                // Use explicit RGBA for shadow to ensure html2canvas compatibility
                boxShadow: isActive ? '0 0 0 4px #fbbf24' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
        >
            {/* Scaling Wrapper */}
            <div
                className="absolute top-0 left-0 origin-top-left"
                style={{
                    width: SCENE_BASE_WIDTH,
                    height: SCENE_BASE_HEIGHT,
                    transform: `scale(${scale})`,
                }}
            >
                <div
                    className="w-full h-full relative bg-cover bg-center grayscale-[0.2] sepia-[0.2]"
                    style={getBackgroundImageUrl() ? { backgroundImage: getBackgroundImageUrl() } : { backgroundColor: '#fdf6e3' }}
                >
                    {/* This mimics the "stage" */}
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(44, 24, 16, 0.05)' }} />
                    {scene.slots.map(slot => {
                        // Resolve animated coordinates
                        const resolveCoord = (val: number | number[]) => {
                            if (Array.isArray(val)) {
                                return val[globalFrame % val.length];
                            }
                            return val;
                        };

                        // Resolve animated booleans
                        const resolveBool = (val: boolean | boolean[] | undefined) => {
                            if (Array.isArray(val)) {
                                return val[globalFrame % val.length];
                            }
                            return val;
                        };

                        return (
                            <Slot
                                key={slot.id}
                                id={slot.id}
                                x={resolveCoord(slot.x)}
                                y={resolveCoord(slot.y)}
                                scale={resolveCoord(slot.scale || 1)}
                                shape={slot.shape}
                                flipX={resolveBool(slot.flipX)}
                                flipY={resolveBool(slot.flipY)}
                                placedItem={slot.placedItemId ?
                                    levelItems.find(i => i.id === slot.placedItemId)
                                    : undefined
                                }
                                forcedState={getForcedState(slot.placedItemId || undefined)} // Pass animation state override
                                allowedTypes={slot.allowedTypes}
                            />
                        );
                    })}

                    {/* Title Overlay */}
                    {displayTitle && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] flex justify-center pointer-events-none z-10">
                            <h3 className="scene-title font-serif-bold text-center uppercase tracking-widest animate-fade-in shadow-sm backdrop-blur-sm pointer-events-auto cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setIsZoomed(true)}
                                style={{
                                    fontSize: '1.5rem',
                                    color: '#2c1810',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    width: 'fit-content',
                                }}>
                                {displayTitle}
                            </h3>
                        </div>
                    )}

                    {/* Zoom Modal Portal */}
                    {isZoomed && displayTitle && createPortal(
                        <>
                            <style>
                                {`
                                    @keyframes zoomPopIn {
                                        0% { transform: scale(0.8); opacity: 0; }
                                        100% { transform: scale(1); opacity: 1; }
                                    }
                                    @keyframes zoomBackdropFade {
                                        0% { opacity: 0; }
                                        100% { opacity: 1; }
                                    }
                                `}
                            </style>
                            <div
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-pointer"
                                onClick={() => {
                                    setIsZoomed(false);
                                    onModalClosed?.();
                                }}
                                style={{
                                    animation: 'zoomBackdropFade 300ms ease-out forwards',
                                    pointerEvents: 'auto', // Ensure immediate interaction
                                    willChange: 'opacity'
                                }}
                            >
                                <h3 className="font-serif-bold text-center uppercase tracking-widest shadow-lg cursor-auto"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        fontSize: '1.5rem',
                                        color: '#2c1810',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        padding: '16px 24px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        width: 'fit-content',
                                        maxWidth: '90%',
                                        animation: 'zoomPopIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                                        willChange: 'transform, opacity'
                                    }}>
                                    {displayTitle}
                                </h3>
                            </div>
                        </>,
                        document.body
                    )}
                </div>
            </div>

            {/* Preload Animated Backgrounds to prevent flickering */}
            {Array.isArray(scene.backgroundImage) && (
                <div className="hidden">
                    {scene.backgroundImage.map((src, idx) => (
                        <img key={idx} src={src} alt="preload" />
                    ))}
                </div>
            )}
        </div>

    );
};
