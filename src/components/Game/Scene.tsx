import type { Scene as SceneType } from '../../types';
import { Slot } from './Slot';
import clsx from 'clsx';

interface SceneProps {
    scene: SceneType;
    isActive: boolean;
}

export const Scene = ({ scene, isActive }: SceneProps) => {
    // Can drop anywhere in the scene? Or just slots?
    // If we want the scene to accept items and auto-place in first slot, we could make it droppable.
    // For now, let's keep it simple: drop only on slots.

    // However, maybe dragging an item *over* a scene but not a slot should show highlight?
    // Let's stick to slot dropping for MVP.

    return (
        <div className={clsx(
            "bg-white border-2 border-slate-800 rounded-sm p-2 flex flex-col gap-2 shadow-sm min-h-[160px]",
            isActive ? "ring-2 ring-amber-400" : ""
        )}>
            <div className="flex-1 bg-sky-100 rounded border border-slate-200 relative flex justify-around items-end pb-4">
                {/* This mimics the "stage" */}
                {scene.slots.map(slot => (
                    <Slot
                        key={slot.id}
                        id={slot.id}
                        placedItem={slot.placedItemId ?
                            // We need to resolve the item object. 
                            // In a real app we might pass full items down or have a lookup.
                            // For MVP let's assume parent passes looked-up items or we need a hook?
                            // Let's hack it: Store only has IDs. We need the lookup.
                            // Let's pass a helper to lookup item? 
                            // Actually, let's refactor this to accept resolved items or use context?
                            // Simple solution: parent (Book) passes full objects?
                            // OR: we import ITEMS from levels? No, that's circular or messy.
                            // Better: Helper function or Hook.
                            undefined // Temporarily undefined until we fix data flow
                            : undefined
                        }
                        allowedTypes={slot.allowedTypes}
                    />
                ))}
            </div>
            {scene.description && (
                <div className="text-center font-serif text-sm italic border-t pt-1 border-slate-100">
                    {scene.description}
                </div>
            )}
        </div>
    );
};
