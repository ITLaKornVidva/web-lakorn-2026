import { useDroppable } from '@dnd-kit/core';
import { DraggableItem } from './DraggableItem';
import type { Item } from '../../types';
import clsx from 'clsx';

interface SlotProps {
    id: string;
    x: number;
    y: number;
    placedItem?: Item;
    allowedTypes: string[];
    shape?: 'ellipse' | 'rectangle';
    scale?: number;
    flipX?: boolean;
    flipY?: boolean;
    forcedState?: string;
}

export const Slot = ({ id, x, y, placedItem, allowedTypes, shape = 'ellipse', scale = 1, flipX, flipY, forcedState }: SlotProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        data: { allowedTypes, scale },
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "absolute flex items-center justify-center", // Removed transition-all duration-300 for snap animation
                shape === 'ellipse' ? "rounded-[50%]" : "rounded-sm",
                placedItem ? "z-10" : "z-0"
            )}
            style={{
                left: x,
                top: y,
                width: '5rem',
                height: '5rem',
                // Manual ring/bg logic
                backgroundColor: isOver ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
                boxShadow: isOver ? '0 0 0 4px rgba(251, 191, 36, 0.5)' : 'none',
                transform: isOver ? 'scale(1.05)' : 'scale(1)'
            }}
        >
            {placedItem ? (
                <div className="w-full h-full flex items-center justify-center"
                    style={{
                        transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`
                    }}>
                    <DraggableItem item={placedItem} id={`item-in-${id}`} forcedState={forcedState} />
                </div>
            ) : (
                <>
                    {/* Visual preview of scaled item area */}
                    <div
                        className={clsx(
                            "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
                            isOver ? "opacity-100" : "opacity-0"
                        )}
                        style={{ transform: `scale(${scale})` }}
                    >
                        <div className={clsx(
                            "w-20 h-20 border-2 border-dashed rounded-sm",
                            shape === 'ellipse' && "rounded-[50%]"
                        )}
                            style={{ borderColor: 'rgba(251, 191, 36, 0.5)' }} // Hex equivalent of amber-400/50
                        />
                    </div>
                    {/* Type label */}
                    <div className={clsx(
                        "w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 relative z-10",
                        isOver && "opacity-100"
                    )}>
                        <span className="font-serif-bold uppercase tracking-wider text-center pointer-events-none px-2 rounded-full"
                            style={{
                                fontSize: '10px',
                                color: 'rgba(120, 53, 15, 0.4)', // amber-900/40
                                backgroundColor: 'rgba(255, 255, 255, 0.4)' // white/40
                            }}>
                            {allowedTypes[0]}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};
