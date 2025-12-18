import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';
import { Scene } from './Scene';
import { Tray } from './Tray';
import { ItemVisual } from './DraggableItem';
import { SettingsModal } from '../UI/SettingsModal';
import type { Item } from '../../types';
import { levels } from '../../data/levels';


export const Book = () => {
    const navigate = useNavigate();
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
        unlockLevel
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
        console.log('handleDragEnd called', { activeId: active.id, overId: over?.id });
        setActiveDragItem(null);

        const activeId = active.id.toString();

        // Find which scene a slot belongs to
        const findSceneBySlotId = (slotId: string) =>
            currentScenes.find(s => s.slots.some(slot => slot.id === slotId));

        // Helper to check if drop is valid
        const isDropValid = (draggedItem: Item, targetData: any) => {
            const allowedTypes = targetData?.allowedTypes as string[] | undefined;

            // Check 1: Allowed Types
            if (allowedTypes && !allowedTypes.includes(draggedItem.type)) {
                return false;
            }

            // Check 2: (Removed) Slot occupation check removed to allow swapping/replacement
            // The store handles returning to tray or swapping if occupied.

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

                if (scene && droppedItem && isDropValid(droppedItem, over.data.current)) {
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
                const toSlot = toScene?.slots.find(s => s.id === toSlotId);
                const fromSlot = fromScene.slots.find(s => s.id === fromSlotId);

                // Validation Logic
                if (toScene && droppedItem && fromSlot) {
                    // Check 1: Is Dragged Item allowed in Target Slot?
                    const isDraggedAllowed = isDropValid(droppedItem, over.data.current);

                    // Check 2: If occupied, is Target Item allowed in Source Slot?
                    let isSwapAllowed = true;
                    if (toSlot && toSlot.placedItemId) {
                        // We need the Item object for the target item to check its type.
                        // But we only have the ID. We can find it in availableItems or levels data.
                        // Since availableItems in store has everything, we can look there.
                        const targetItem = availableItems.find(i => i.id === toSlot.placedItemId);

                        if (targetItem) {
                            // Construct targetData mock for isDropValid or just check types directly
                            // fromSlot has allowedTypes.
                            const sourceAllowedTypes = fromSlot.allowedTypes;
                            if (!sourceAllowedTypes.includes(targetItem.type)) {
                                isSwapAllowed = false;
                            }
                        }
                    }

                    if (isDraggedAllowed && isSwapAllowed) {
                        moveItem(fromScene.id, fromSlotId, toScene.id, toSlotId);
                    }
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
            unlockLevel(nextLevelId);
            loadLevel(nextLevelId);
            navigate(`/game/${nextLevelId}`);
        } else {
            alert("No more levels! Thanks for playing.");
        }
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

            {/* Portrait Warning Overlay */}
            <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center landscape:hidden w-screen h-screen">
                <div className="text-6xl mb-4 animate-pulse">↻</div>
                <h2 className="text-3xl font-serif mb-2">Please Rotate Device</h2>
                <p className="text-slate-300 font-serif">The story unfolds in landscape mode.</p>
            </div>

            {/* Main Game Content - Landscape Only */}
            <div className="fixed inset-0 overflow-hidden hidden landscape:flex flex-col">
                {/* Back Arrow */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 md:top-8 left-0 bg-[#f5e6d3]/80 hover:bg-[#f5e6d3] text-[#2c1810]/70 hover:text-[#2c1810] transition-all z-20 px-2 md:px-3 py-2 md:py-3 rounded-r-lg shadow-md"
                >
                    <svg style={{ width: 'clamp(24px, 4vw, 40px)', height: 'clamp(24px, 4vw, 40px)' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                {/* Settings Button */}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="absolute top-4 md:top-8 right-0 bg-[#f5e6d3]/80 hover:bg-[#f5e6d3] text-[#2c1810]/70 hover:text-[#2c1810] transition-all z-20 px-2 md:px-3 py-2 md:py-3 rounded-l-lg shadow-md"
                    title="Settings"
                >
                    <svg style={{ width: 'clamp(24px, 4vw, 40px)', height: 'clamp(24px, 4vw, 40px)' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                    </svg>
                </button>

                {/* Section 1: Story Background / Intro (Top) */}
                <div className="h-full w-full flex items-center justify-center text-center">
                    <div className="max-w-4xl flex flex-col items-center">
                        <h2 className="text-[#2c1810] font-serif-bold leading-tight animate-fade-in uppercase tracking-widest text-balance" style={{ fontSize: 'clamp(0.75rem, 2.3vw, 2rem)' }}>
                            {currentLevel.goal}
                        </h2>
                    </div>
                </div>

                {/* Section 2: Playing Field / Scenes (Middle) */}
                <div className="h-full w-full">
                    <div className="h-full w-full flex flex-nowrap gap-4 md:gap-2 min-w-max mx-auto items-center justify-center">
                        {currentScenes.map((scene) => (
                            <div key={scene.id} className="w-[28vw] flex-shrink-0">
                                <Scene
                                    scene={scene}
                                    isActive={false}
                                    levelItems={currentLevel.availableItems}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Interaction Tray (Bottom) */}
                <div className="h-full w-full relative flex items-center justify-center">
                    <div className="py-2 md:px-12">
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
                        <div className="cursor-grabbing rotate-3 transition-transform shadow-2xl">
                            {/* Use Visual component solely! No dragging logic here */}
                            <ItemVisual item={activeDragItem} />
                        </div>
                    ) : null}
                </DragOverlay>

                {/* Settings Modal */}
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            </div>
        </DndContext>
    );
};
