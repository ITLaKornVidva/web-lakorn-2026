import { useRef, useState, useEffect } from 'react';
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
}

export const Scene = ({ scene, isActive, levelItems, overrideTitle, hideTitle, overrideCharacterStates }: SceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

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

    return (
        <div
            ref={containerRef}
            className={clsx(
                "overflow-hidden flex flex-col shadow-lg", // Removed transition-all duration-500
                "aspect-[4/3] w-full relative",
                isActive ? "scale-[1.02]" : ""
            )}
            style={{
                backgroundColor: '#ffffff',
                border: '2px solid #2c1810',
                boxShadow: isActive ? '0 0 0 4px #fbbf24' : 'none' // Manual ring
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
                        <div className="absolute top-4 left-0 w-full flex justify-center pointer-events-none z-10">
                            <h3 className="font-serif-bold text-center uppercase tracking-widest animate-fade-in shadow-sm backdrop-blur-sm"
                                style={{
                                    fontSize: '1.5rem',
                                    color: '#2c1810',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    padding: '4px 16px',
                                    borderRadius: '9999px'
                                }}>
                                {displayTitle}
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
