import { useDraggable } from '@dnd-kit/core';
import type { Item } from '../../types';
import { CSS } from '@dnd-kit/utilities';

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
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`w-16 h-16 flex items-center justify-center text-4xl bg-white rounded-full shadow-md border-2 border-amber-200 transition-transform ${disabled ? '' : 'hover:scale-110'}`}
            title={item.name}
        >
            {item.icon}
        </div>
    );
};
