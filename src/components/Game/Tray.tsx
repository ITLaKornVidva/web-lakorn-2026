import type { Item } from '../../types';
import { DraggableItem } from './DraggableItem';

interface TrayProps {
    items: Item[];
}

export const Tray = ({ items }: TrayProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 p-4 border-t-4 border-amber-700 flex justify-center gap-8 shadow-2xl z-50">
            {items.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-2">
                    <DraggableItem item={item} id={`tray-${item.id}`} />
                    <span className="text-amber-100 text-xs font-bold uppercase tracking-widest">{item.name}</span>
                </div>
            ))}
        </div>
    );
};
