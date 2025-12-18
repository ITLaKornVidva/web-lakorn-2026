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
}

export const Slot = ({ id, x, y, placedItem, allowedTypes, shape = 'ellipse', scale }: SlotProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        data: { allowedTypes, scale },
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "absolute flex items-center justify-center transition-all duration-300",
                shape === 'ellipse' ? "w-20 h-20 rounded-[50%]" : "w-20 h-20 rounded-sm",
                isOver ? "bg-amber-400/20 ring-4 ring-amber-400/50 scale-105" : "bg-transparent",
                placedItem ? "z-10" : "z-0"
            )}
            style={{
                left: x,
                top: y,
                // transform: `translate(-50%, -50%)`,
            }}
        >
            {placedItem ? (
                <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
                    <DraggableItem item={placedItem} id={`item-in-${id}`} />
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
                            "w-20 h-20 border-2 border-dashed border-amber-400/50 rounded-sm",
                            shape === 'ellipse' && "rounded-[50%]"
                        )} />
                    </div>
                    {/* Type label */}
                    <div className={clsx(
                        "w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 relative z-10",
                        isOver && "opacity-100"
                    )}>
                        <span className="text-[10px] text-amber-900/40 font-serif-bold uppercase tracking-wider text-center pointer-events-none px-2 bg-white/40 rounded-full">
                            {allowedTypes[0]}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};
