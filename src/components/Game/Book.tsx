import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';
import { Scene } from './Scene';
import { Tray } from './Tray';
import { DraggableItem } from './DraggableItem';
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

    // Load level on mount
    useEffect(() => {
        loadLevel('level-1');
    }, [loadLevel]);

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
        console.log('handleDragEnd called', { activeId: active.id, overId: over?.id });
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
            <div className="fixed inset-0 overflow-hidden hidden landscape:flex flex-col">
                {/* Back Arrow */}
                <button className="absolute top-8 left-8 text-[#2c1810]/60 hover:text-[#2c1810] transition-colors z-20">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                {/* Section 1: Story Background / Intro (Top) */}
                <div className="h-[16.67vh] w-full flex items-center justify-center px-6 md:px-12 text-center">
                    <div className="max-w-4xl">
                        <h2 className="text-[#2c1810] font-serif-bold leading-tight animate-fade-in uppercase tracking-widest text-balance" style={{ fontSize: 'clamp(1rem, 3vw, 2.5rem)' }}>
                            {currentLevel.goal}
                        </h2>
                        <div className="h-[2px] w-32 bg-[#2c1810]/20 mx-auto mt-3 md:mt-6 rounded-full"></div>
                    </div>
                </div>

                {/* Section 2: Playing Field / Scenes (Middle) */}
                <div className="h-[66.67vh] w-full flex items-center overflow-x-auto overflow-y-hidden px-6 md:px-10 gap-5 custom-scrollbar flex-nowrap">
                    <div className="flex flex-nowrap gap-8 md:gap-16 py-4 md:py-8 min-w-max mx-auto items-start">
                        {currentScenes.map((scene) => (
                            <div key={scene.id} className="w-[45vh] flex-shrink-0">
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

                {/* Section 3: Interaction Tray (Bottom) */}
                <div className="h-[16.67vh] w-full relative flex items-center justify-center">
                    <div className="py-2 md:py-4 px-6 md:px-12">
                        <Tray items={availableItems} counts={trayCounts} />
                    </div>

                    {/* Level Progress Indicator / Next Button */}
                    <div className={`absolute bottom-4 md:bottom-8 right-6 md:right-12 transition-all duration-700 ${isLevelSolved ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} z-[60]`}>
                        <button
                            onClick={handleNextLevel}
                            className="group bg-[#4a2c2a] hover:bg-[#5d3a37] text-amber-100 font-serif-bold px-6 md:px-12 py-3 md:py-5 rounded-sm shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 md:gap-4 border border-amber-900/20"
                            style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
                        >
                            <span className="uppercase tracking-widest">Next Chapter</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeDragItem ? (
                        <div className="cursor-grabbing scale-125 rotate-3 transition-transform shadow-2xl">
                            <DraggableItem item={activeDragItem} id={`overlay-${activeDragItem.id}`} />
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};
