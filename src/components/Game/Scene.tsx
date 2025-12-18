import type { Scene as SceneType, Item } from '../../types';
import { SCENE_BASE_WIDTH, SCENE_BASE_HEIGHT } from '../../types';
import { Slot } from './Slot';
import { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

interface SceneProps {
    scene: SceneType;
    isActive: boolean;
    levelItems: Item[];
    isSolved: boolean;
}

export const Scene = ({ scene, isActive, levelItems, isSolved }: SceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

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

    return (
        <div className="flex flex-col items-center w-full">
            <div className={clsx(
                "h-5 lg:h-8 transition-all duration-1000 ease-out",
                isSolved ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}>
                {scene.title && (
                    <h3 className="font-serif-bold text-[#2c1810]/80 text-center uppercase tracking-widest" style={{ fontSize: 'clamp(0.75rem, 1.3vw, 1rem)' }}>
                        {scene.title}
                    </h3>
                )}
            </div>
            <div
                ref={containerRef}
                className={clsx(
                    "bg-white border-2 border-[#2c1810] overflow-hidden flex flex-col shadow-lg transition-all duration-500",
                    "aspect-[4/3] w-full relative",
                    isActive ? "ring-4 ring-amber-400 scale-[1.02]" : ""
                )}
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
                        style={scene.backgroundImage ? { backgroundImage: `url(${scene.backgroundImage})` } : { backgroundColor: '#fdf6e3' }}
                    >
                        {/* This mimics the "stage" */}
                        <div className="absolute inset-0 bg-[#2c1810]/5 pointer-events-none" />
                        {scene.slots.map(slot => (
                            <Slot
                                key={slot.id}
                                id={slot.id}
                                x={slot.x}
                                y={slot.y}
                                scale={slot.scale}
                                shape={slot.shape}
                                placedItem={slot.placedItemId ?
                                    levelItems.find(i => i.id === slot.placedItemId)
                                    : undefined
                                }
                                allowedTypes={slot.allowedTypes}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
