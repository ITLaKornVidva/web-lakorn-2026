import { useDroppable } from '@dnd-kit/core';
import { DraggableItem } from './DraggableItem';
import type { Item } from '../../types';
import clsx from 'clsx';

interface SlotProps {
    id: string;
    placedItem?: Item;
    allowedTypes: string[];
}

export const Slot = ({ id, placedItem, allowedTypes }: SlotProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        data: { allowedTypes },
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "relative w-24 h-24 border-dashed border-2 rounded-lg flex items-center justify-center transition-colors",
                isOver ? "border-green-500 bg-green-50" : "border-slate-300 bg-slate-50/50",
                placedItem ? "border-solid border-amber-300" : ""
            )}
        >
            {placedItem ? (
                // Render item but maybe we want it draggable FROM the slot too?
                // If so, we need a unique ID for this instance in this slot.
                // For simple MVP let's assume once placed it can be dragged out.
                // We'll give it a predictable ID like `item-in-{slotId}` or re-use original if unique in scene?
                // Let's use `placedItem-${id}` for drag ID so we know where it came from.
                <DraggableItem item={placedItem} id={`item-in-${id}`} />
            ) : (
                <span className="text-xs text-slate-400 font-serif italic text-center">
                    {allowedTypes.join(' / ')}
                </span>
            )}
        </div>
    );
};
