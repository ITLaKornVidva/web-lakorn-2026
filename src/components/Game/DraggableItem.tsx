import { useDraggable } from '@dnd-kit/core';
import type { Item } from '../../types';
import clsx from 'clsx';

interface DraggableItemProps {
    item: Item;
    id: string; // unique drag id
    disabled?: boolean;
}

// Visual component for consistency between original and overlay
export const ItemVisual = ({ item, disabled, isDragging, className }: { item: Item, disabled?: boolean, isDragging?: boolean, className?: string }) => {
    const isImageIcon = item.icon.startsWith('/') || item.icon.startsWith('http');

    return (
        <div
            className={clsx(
                "w-16 h-16 flex items-center justify-center transition-all duration-300",
                !isImageIcon && "text-5xl bg-[url('/assets/parchment_bg.png')] bg-cover border border-[#2c1810]/40 rounded-sm shadow-md",
                disabled ? "opacity-30 grayscale cursor-not-allowed" : "cursor-grab",
                !disabled && !isDragging && "active:cursor-grabbing hover:scale-105",
                className
            )}
            title={item.name}
        >
            {isImageIcon ? (
                <img src={item.icon} alt={item.name} className="w-full h-full object-contain pointer-events-none drop-shadow-md" />
            ) : (
                <span className="drop-shadow-sm">{item.icon}</span>
            )}
        </div>
    );
};

export const DraggableItem = ({ item, id, disabled }: DraggableItemProps) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        data: { item },
        disabled: disabled,
    });

    const style = {
        // transform: CSS.Translate.toString(transform), // REMOVE transform to prevent ghost movement
        opacity: isDragging ? 0.3 : 1, // Fade out original, don't move it
        cursor: disabled ? 'not-allowed' : 'grab',
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            <ItemVisual item={item} disabled={disabled} isDragging={isDragging} />
        </div>
    );
};
