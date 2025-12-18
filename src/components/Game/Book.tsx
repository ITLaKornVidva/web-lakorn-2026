import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';
import { Scene } from './Scene';
import { Tray } from './Tray';
import { DraggableItem } from './DraggableItem';
import { SettingsModal } from '../UI/SettingsModal';
import { useState, useEffect } from 'react';
import type { Item } from '../../types';
import { levels } from '../../data/levels';

export const Book = () => {
    const {
        currentLevelId,
        currentScenes,
        availableItems,
        trayCounts,
        placeItemFromTray,
        moveItem,
        returnItemToTray,
        loadLevel,
        isLevelSolved,
        sceneSolvedStatus
    } = useGameStore();

    const [activeDragItem, setActiveDragItem] = useState<Item | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Load level on mount or when needed
    useEffect(() => {
        // Only load if scenes are empty (e.g. after refresh) to rely on persisted currentLevelId
        if (currentScenes.length === 0) {
            loadLevel(currentLevelId);
        }
    }, [loadLevel, currentLevelId, currentScenes.length]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const currentLevel = levels.find(l => l.id === currentLevelId);

    // Find next level logic
    const currentLevelIndex = levels.findIndex(l => l.id === currentLevelId);
    const nextLevelId = levels[currentLevelIndex + 1]?.id;

    if (!currentLevel) return <div>Loading Level...</div>;

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const item = active.data.current?.item as Item;
        setActiveDragItem(item);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        const activeId = active.id.toString();

        // Find which scene a slot belongs to
        const findSceneBySlotId = (slotId: string) =>
            currentScenes.find(s => s.slots.some(slot => slot.id === slotId));

        // Helper to check if drop is valid
        const isDropValid = (draggedItem: Item, targetData: any, targetSlotId?: string) => {
            const allowedTypes = targetData?.allowedTypes as string[] | undefined;

            // Check 1: Allowed Types
            if (allowedTypes && !allowedTypes.includes(draggedItem.type)) {
                return false;
            }

            // Check 2: Slot is empty
            if (targetSlotId) {
                const scene = findSceneBySlotId(targetSlotId);
                const slot = scene?.slots.find(s => s.id === targetSlotId);
                if (slot && slot.placedItemId) {
                    return false;
                }
            }

            return true;
        };

        // Case 1: Dragging from Tray
        if (activeId.startsWith('tray-')) {
            const itemId = activeId.replace('tray-', '');
            // We need the item object. active.data.current.item should have it based on DraggableItem.tsx
            const droppedItem = active.data.current?.item as Item;

            // Case 1.1: Dropped onto a slot
            if (over && over.id.toString().startsWith('slot-')) {
                const slotId = over.id as string;
                const scene = findSceneBySlotId(slotId);

                if (scene && droppedItem && isDropValid(droppedItem, over.data.current, slotId)) {
                    placeItemFromTray(scene.id, slotId, itemId);
                }
            }
            // Case 1.2: Dropped outside - do nothing
        }

        // Case 2: Dragging from a Slot
        else if (activeId.startsWith('item-in-')) {
            const fromSlotId = activeId.replace('item-in-', '');
            const fromScene = findSceneBySlotId(fromSlotId);
            const droppedItem = active.data.current?.item as Item; // Item is passed in data for slot items too? 
            // Checking Slot.tsx -> DraggableItem -> yes it passes item.

            if (!fromScene) return;

            // Case 2.1: Dropped onto a slot (Move)
            if (over && over.id.toString().startsWith('slot-')) {
                const toSlotId = over.id as string;
                const toScene = findSceneBySlotId(toSlotId);

                if (toScene && droppedItem && isDropValid(droppedItem, over.data.current, toSlotId)) {
                    moveItem(fromScene.id, fromSlotId, toScene.id, toSlotId);
                } else {
                    // Do nothing
                }
            }
            // Case 2.2: Dropped outside (Remove/Return to tray)
            else {
                returnItemToTray(fromScene.id, fromSlotId);
            }
        }
    };

    const handleNextLevel = () => {
        if (nextLevelId) {
            loadLevel(nextLevelId);
        } else {
            alert("No more levels! Thanks for playing.");
        }
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* Portrait Warning Overlay */}
            <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center landscape:hidden">
                <div className="text-6xl mb-4 animate-pulse">↻</div>
                <h2 className="text-3xl font-serif mb-2">Please Rotate Device</h2>
                <p className="text-slate-300 font-serif">The story unfolds in landscape mode.</p>
            </div>

            {/* Main Game Content - Landscape Only */}
            <div className="min-h-screen bg-[#fdf6e3] flex-col items-center py-4 pb-32 hidden landscape:flex">
                <header className="mb-4 text-center shrink-0">
                    <h1 className="text-3xl font-serif text-slate-800 mb-1">My Storyteller</h1>
                    <div className="bg-white border text-lg px-6 py-1 rounded-lg shadow-sm inline-block">
                        <span className="font-bold text-slate-500 mr-2">Level {currentLevelIndex + 1}:</span>
                        <span className="font-serif italic">{currentLevel.title}</span>
                        <div className="text-sm text-slate-600 mt-0.5">{currentLevel.goal}</div>
                    </div>
                </header>

                {/* Horizontal Scrolling Scenes Container */}
                <div className="w-full max-w-full flex-1 flex flex-col justify-center overflow-hidden">
                    <div className="flex flex-row items-start gap-6 px-8 overflow-x-auto pb-6 pt-2 w-full snap-x snap-mandatory touch-pan-x justify-start lg:justify-center custom-scrollbar">
                        {currentScenes.map((scene) => (
                            <div key={scene.id} className="min-w-[300px] w-[320px] max-w-[400px] flex-shrink-0 snap-center transition-transform hover:scale-[1.01]">
                                <Scene
                                    scene={scene}
                                    isActive={false}
                                    levelItems={currentLevel.availableItems}
                                    isSolved={!!sceneSolvedStatus[scene.id]}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Level Button */}
                <div className={`fixed bottom-8 right-8 transition-opacity duration-1000 ${isLevelSolved ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} z-50`}>
                    <button
                        onClick={handleNextLevel}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-serif text-xl px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <span>Next Level</span>
                        <span>→</span>
                    </button>
                </div>

                <Tray items={availableItems} counts={trayCounts} />

                <DragOverlay>
                    {activeDragItem ? (
                        <div className="cursor-grabbing">
                            <DraggableItem item={activeDragItem} id={`overlay-${activeDragItem.id}`} />
                        </div>
                    ) : null}
                </DragOverlay>

                {/* Settings Modal */}
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            </div>
        </DndContext>
    );
};
