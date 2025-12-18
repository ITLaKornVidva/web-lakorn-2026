import { DraggableItem } from './DraggableItem';
import type { Item } from '../../types';

interface TrayProps {
    items: Item[];
    counts: Record<string, number>;
}

export const Tray = ({ items, counts }: TrayProps) => {
    return (
        <div className="w-full h-full flex items-center justify-center gap-10 px-12">
            {items.map((item) => {
                const count = counts[item.id] || 0;
                const isExhausted = count === 0;

                return (
                    <div key={item.id} className="flex flex-col items-center gap-4 transition-all duration-300">
                        <div className="relative group">
                            <DraggableItem item={item} id={`tray-${item.id}`} disabled={isExhausted} />
                        </div>
                        <span className="font-serif-bold text-[#2c1810] uppercase tracking-wider" style={{ fontSize: 'clamp(0.625rem, 1.5vw, 0.875rem)' }}>
                            {item.name} (x{count})
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
