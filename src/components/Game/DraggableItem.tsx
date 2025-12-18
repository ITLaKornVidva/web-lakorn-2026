import { useDraggable } from '@dnd-kit/core';
import type { Item } from '../../types';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

interface DraggableItemProps {
    item: Item;
    id: string; // unique drag id
    disabled?: boolean;
}

export const DraggableItem = ({ item, id, disabled }: DraggableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { item },
        disabled: disabled,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'grab',
        touchAction: 'none',
    };

    const isImageIcon = item.icon.startsWith('/') || item.icon.startsWith('http');

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={clsx(
                "w-20 h-20 flex items-center justify-center transition-all duration-300",
                !isImageIcon && "text-5xl bg-[url('/assets/parchment_bg.png')] bg-cover border border-[#2c1810]/40 rounded-sm shadow-md",
                disabled ? "opacity-30 grayscale cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:scale-105"
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
