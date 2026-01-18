import { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import type { Scene as SceneType, Item } from '../types';
import { SCENE_BASE_WIDTH, SCENE_BASE_HEIGHT } from '../types';
import { ItemVisual } from './Game/DraggableItem';

interface MiniSlotProps {
    x: number;
    y: number;
    placedItem?: Item;
    shape?: 'ellipse' | 'rectangle';
    scale?: number;
    flipX?: boolean;
    flipY?: boolean;
}

const MiniSlot = ({ x, y, placedItem, shape = 'ellipse', scale = 1, flipX, flipY }: MiniSlotProps) => {
    return (
        <div
            className={clsx(
                "absolute flex items-center justify-center pointer-events-none",
                shape === 'ellipse' ? "w-20 h-20 rounded-[50%]" : "w-20 h-20 rounded-sm",
                placedItem ? "z-10" : "z-0"
            )}
            style={{
                left: x,
                top: y,
            }}
        >
            {placedItem ? (
                <div className="w-full h-full flex items-center justify-center"
                    style={{ transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})` }}>
                    <ItemVisual item={placedItem} />
                </div>
            ) : (
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-30"
                    style={{ transform: `scale(${scale})` }}
                >
                    <div className={clsx(
                        "w-20 h-20 border-2 border-dashed border-[#2c1810]/30 rounded-sm",
                        shape === 'ellipse' && "rounded-[50%]"
                    )} />
                </div>
            )}
        </div>
    );
};

interface MiniSceneProps {
    scene: SceneType;
    levelItems: Item[];
    className?: string;
}

export const MiniScene = ({ scene, levelItems, className }: MiniSceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.2); // Default small

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

    const getBackgroundImageUrl = () => {
        const bg = scene.backgroundImage;
        if (Array.isArray(bg)) {
            return `url(${bg[0]})`;
        }
        return bg ? `url(${bg})` : undefined;
    };

    return (
        <div
            ref={containerRef}
            className={clsx(
                "relative bg-white overflow-hidden aspect-[4/3] w-full",
                className
            )}
        >
            <div
                className="absolute top-0 left-0 origin-top-left pointer-events-none"
                style={{
                    width: SCENE_BASE_WIDTH,
                    height: SCENE_BASE_HEIGHT,
                    transform: `scale(${scale})`,
                }}
            >
                <div
                    className="w-full h-full relative bg-cover bg-center"
                    style={getBackgroundImageUrl() ? { backgroundImage: getBackgroundImageUrl() } : { backgroundColor: '#fdf6e3' }}
                >
                    {/* Dark overlay for better visibility of uncompleted slots, or just style choice */}
                    <div className="absolute inset-0 bg-[#2c1810]/5" />

                    {scene.slots.map(slot => (
                        <MiniSlot
                            key={slot.id}
                            x={Array.isArray(slot.x) ? slot.x[0] : slot.x}
                            y={Array.isArray(slot.y) ? slot.y[0] : slot.y}
                            scale={Array.isArray(slot.scale) ? slot.scale[0] : slot.scale}
                            shape={slot.shape}
                            flipX={Array.isArray(slot.flipX) ? slot.flipX[0] : slot.flipX}
                            flipY={Array.isArray(slot.flipY) ? slot.flipY[0] : slot.flipY}
                            placedItem={slot.placedItemId ?
                                levelItems.find(i => i.id === slot.placedItemId)
                                : undefined
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
