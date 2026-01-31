import { useDraggable } from '@dnd-kit/core';
import type { Item } from '../../types';
import clsx from 'clsx';

interface DraggableItemProps {
    item: Item;
    id: string; // unique drag id
    disabled?: boolean;
}

// Visual component for consistency between original and overlay
import { useGameStore } from '../../store/gameStore';

// Animation Config
const GET_ANIMATION_FRAMES = (state: string, baseName: string): string[] => {
    if (state === 'work') {
        // Player animation: work > idle
        if (baseName.startsWith('player') || baseName === 'you') {
            return ['work', 'sleep'];
        }
        // Citizen animation: work1 > work2
        return ['work1', 'work2'];
    }
    if (state === 'dance') {
        return ['dance', 'idle'];
    }
    return [];
};

export const ItemVisual = ({ item, disabled, isDragging, className, forcedState }: { item: Item, disabled?: boolean, isDragging?: boolean, className?: string, forcedState?: string }) => {
    const characterId = useGameStore(state => state.characterId);
    const globalFrame = useGameStore(state => state.globalAnimationFrame);

    // Resolve Base Name first to determine frames
    let baseName = item.spriteName || '';
    if (baseName === 'player') {
        baseName = characterId || 'player1';
    }

    // Resolve State
    // Priority: forcedState > item.defaultState > 'idle'
    const targetState = forcedState || item.defaultState || 'idle';

    // Determine current frame from global tick
    // We cannot just use globalFrame directly because some animations might have different lengths?
    // Actually, for sync, we SHOULD use globalFrame directly modulo length.
    // This ensures that "Frame 0" of background aligns with "Frame 0" of character.

    // Resolve Dynamic Image Path
    let iconSrc = item.icon;

    // Special Case: Book Open
    if (item.id === 'book' && targetState === 'open') {
        iconSrc = '/assets/open_book.png';
    }
    // General Sprite Logic
    else if (item.spriteName) {
        let stateTag = targetState;
        const frames = GET_ANIMATION_FRAMES(targetState, baseName);
        if (frames && frames.length > 0) {
            stateTag = frames[globalFrame % frames.length];
        }
        iconSrc = `/assets/characters/${baseName}_${stateTag}.png`;
    }

    const isImageIcon = iconSrc.startsWith('/') || iconSrc.startsWith('http');
    const isTextAction = item.type === 'action' && !isImageIcon;

    return (
        <div
            className={clsx(
                "flex items-center justify-center transition-all duration-300",
                isTextAction && "action-item-container", // MARKER CLASS for html2canvas
                isTextAction
                    ? "px-3 py-1 bg-[#2c1810]/90 text-[#f5e6d3] border border-[#f5e6d3]/40 rounded-full font-serif font-bold text-[10px] tracking-[0.15em] backdrop-blur-sm whitespace-nowrap"
                    : "w-16 h-16",
                !isImageIcon && !isTextAction && "text-5xl bg-[url('/assets/parchment_bg.png')] bg-cover border border-[#2c1810]/40 rounded-sm",
                disabled ? "opacity-30 grayscale cursor-not-allowed" : "cursor-grab",
                !disabled && !isDragging && "active:cursor-grabbing hover:scale-105",
                className
            )}
            title={item.name}
            style={{
                // Explicit RGBA shadows to prevent oklab/oklch errors in html2canvas
                // boxShadow: isTextAction ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : (!isImageIcon && !isTextAction ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'),
                // Explicit Backgrounds/Borders for html2canvas compatibility
                backgroundColor: isTextAction ? 'rgba(44, 24, 16, 0.9)' : undefined,
                borderColor: isTextAction ? 'rgba(245, 230, 211, 0.4)' : (!isImageIcon ? 'rgba(44, 24, 16, 0.4)' : undefined)
            }}
        >
            {isImageIcon ? (
                <img src={iconSrc} alt={item.name} className="w-full h-full object-contain pointer-events-none" />
            ) : (
                <span className={clsx(isTextAction && "action-item-text")}>{iconSrc}</span>
            )}
        </div>
    );
};

interface DraggableItemProps {
    item: Item;
    id: string; // unique drag id
    disabled?: boolean;
    forcedState?: string;
}

export const DraggableItem = ({ item, id, disabled, forcedState }: DraggableItemProps) => {
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
            <ItemVisual item={item} disabled={disabled} isDragging={isDragging} forcedState={forcedState} />
        </div>
    );
};
