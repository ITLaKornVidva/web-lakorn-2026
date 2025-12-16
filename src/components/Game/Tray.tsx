import { DraggableItem } from './DraggableItem';
import type { Item } from '../../types';

interface TrayProps {
    items: Item[];
    counts: Record<string, number>;
}

export const Tray = ({ items, counts }: TrayProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 p-4 border-t-4 border-amber-700 flex justify-center gap-8 shadow-2xl z-50">
            {items.map((item) => {
                const count = counts[item.id] || 0;
                const isExhausted = count === 0;

                return (
                    <div key={item.id} className={`flex flex-col items-center gap-2 ${isExhausted ? 'opacity-50 grayscale' : ''}`}>
                        {/* We can still render DraggableItem but maybe disable it inside if count 0? 
                            Or just don't render DraggableItem? 
                            The user wants "shows x0". 
                            If I don't render DraggableItem, I can't drag it. That's good.
                            But maybe show the icon static?
                         */}
                        <div className="relative">
                            <DraggableItem item={item} id={`tray-${item.id}`} disabled={isExhausted} />
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white pointer-events-none">
                                x{count}
                            </div>
                        </div>
                        <span className="text-amber-100 text-xs font-bold uppercase tracking-widest">{item.name}</span>
                    </div>
                );
            })}
        </div>
    );
};
