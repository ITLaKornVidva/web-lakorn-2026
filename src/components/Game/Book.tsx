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
import { TicketModal } from '../TicketModal';


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
        solvedLevels,
        completeGame,
        activeOutcomes

    } = useGameStore();

    const [activeDragItem, setActiveDragItem] = useState<Item | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);

    // LEVEL 4 COMPLETION LOGIC
    // (Timer logic removed - now triggered by Finish button)

    const handleTicketClose = () => {
        setShowTicketModal(false);
        completeGame(); // Navigate to Summary
    };

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
        // console.log('handleDragEnd called', { activeId: active.id, overId: over?.id });
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

                // GUARD: Block drops to Scene 4-2
                if (scene && scene.id === 'scene-4-2') return;

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
            const droppedItem = active.data.current?.item as Item;

            if (!fromScene) return;

            // Case 2.1: Dropped onto a slot (Move)
            if (over && over.id.toString().startsWith('slot-')) {
                const toSlotId = over.id as string;
                const toScene = findSceneBySlotId(toSlotId);
                const toSlot = toScene?.slots.find(s => s.id === toSlotId);
                const fromSlot = fromScene.slots.find(s => s.id === fromSlotId);

                // GUARD: Block moves to Scene 4-2
                if (toScene && toScene.id === 'scene-4-2') return;

                // Validation Logic
                if (toScene && droppedItem && fromSlot) {
                    // Check 1: Is Dragged Item allowed in Target Slot?
                    const isDraggedAllowed = isDropValid(droppedItem, over.data.current);

                    // Check 2: If occupied, is Target Item allowed in Source Slot?
                    let isSwapAllowed = true;
                    if (toSlot && toSlot.placedItemId) {
                        const targetItem = availableItems.find(i => i.id === toSlot.placedItemId);
                        if (targetItem) {
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
        if (currentLevelId === 'level-4') {
            // For Level 4, "Next" means "Finish" -> Open Ticket Modal
            setShowTicketModal(true);
        } else if (nextLevelId) {
            loadLevel(nextLevelId);
            navigate(`/game/${nextLevelId}`);
        } else {
            completeGame();
        }
    };

    // Show Next Button logic:
    // It should show if level is solved OR previously solved.
    // For Level 4, it acts as "Finish", so we DO show it now (Change from previous logic).
    const isLevel4Ready = currentLevelId === 'level-4' && !!activeOutcomes['scene-4-1'];
    const showNextButton = isLevelSolved || solvedLevels.includes(currentLevelId) || isLevel4Ready;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

            {/* Portrait Warning Overlay */}
            <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center landscape:hidden w-screen h-screen">
                <div className="text-6xl mb-4 animate-pulse">↻</div>
                <h2 className="text-3xl font-serif mb-2">Please Rotate Device</h2>
                <p className="text-slate-300 font-serif">The story unfolds in landscape mode.</p>
            </div>

            {/* Main Game Content - Landscape Only */}
            <div className="fixed inset-0 overflow-hidden hidden landscape:flex flex-col h-[100dvh] w-[100dvw] bg-[#f5e6d3] safe-padding">

                {/* Back Arrow */}
                <button
                    onClick={() => navigate('/level-select')}
                    className="absolute top-2 left-safe-offset bg-[#f5e6d3]/80 hover:bg-[#f5e6d3] text-[#2c1810]/70 hover:text-[#2c1810] transition-all z-20 px-2 py-2 rounded-br-lg shadow-sm"
                    style={{ left: 'max(0px, env(safe-area-inset-left))' }}
                >
                    <svg style={{ width: 'clamp(20px, 3vh, 32px)', height: 'clamp(20px, 3vh, 32px)' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                {/* Settings Button */}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="absolute top-2 right-safe-offset bg-[#f5e6d3]/80 hover:bg-[#f5e6d3] text-[#2c1810]/70 hover:text-[#2c1810] transition-all z-20 px-2 py-2 rounded-bl-lg shadow-sm"
                    title="Settings"
                    style={{ right: 'max(0px, env(safe-area-inset-right))' }}
                >
                    <svg style={{ width: 'clamp(20px, 3vh, 32px)', height: 'clamp(20px, 3vh, 32px)' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                    </svg>
                </button>

                {/* Section 1: Story Background / Intro (Top) */}
                <div className="flex-none h-[25%] min-h-[30px] w-full flex items-center justify-center text-center relative z-10">
                    <div className="max-w-4xl flex flex-col items-center px-12">
                        <h2 className="text-[#2c1810] font-serif-bold leading-none animate-fade-in uppercase tracking-widest text-balance drop-shadow-sm" style={{ fontSize: 'clamp(0.65rem, 4vh, 1.5rem)' }}>
                            {currentLevel.goal}
                        </h2>
                    </div>
                </div>

                {/* Section 2: Playing Field / Scenes (Middle) */}
                <div className="flex-1 min-h-0 w-full flex items-center justify-center py-1">
                    <div className="h-full flex flex-nowrap gap-2 md:gap-4 items-center justify-center">
                        {currentScenes.map((originalScene) => {
                            let overrideTitle: string | undefined;
                            let overrideSlots: any[] | undefined;
                            let overrideBgImage: string | string[] | undefined;
                            let overrideCharacterStates: Record<string, string> | undefined;

                            // LEVEL 4 DYNAMIC LOGIC
                            // If this is Scene 2 (The Outcome), we override it based on Scene 1 "Active Outcome"
                            if (currentLevelId === 'level-4' && originalScene.id === 'scene-4-2') {
                                // 1. Check Scene 1 result
                                const scene1Outcome = activeOutcomes['scene-4-1'];
                                if (scene1Outcome) {
                                    let outcomeType = 'default';
                                    if (scene1Outcome.id.includes('scholar')) outcomeType = 'scholar';
                                    else if (scene1Outcome.id.includes('workforce')) outcomeType = 'workforce';
                                    else if (scene1Outcome.id.includes('celebration')) outcomeType = 'celebration';

                                    const config: { title: string, slots: any[], backgroundImage?: string | string[], characterStates?: Record<string, string> } | undefined = {
                                        scholar: {
                                            title: "You traveled back to the present.",
                                            slots: [
                                                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: 350, y: 420, scale: 3, flipX: true }
                                            ],
                                            backgroundImage: '/assets/backgrounds/Background-3.png',
                                            characterStates: { 'you': 'awe' }
                                        },
                                        workforce: {
                                            title: "Now you work hard everyday.",
                                            slots: [
                                                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: [370, 270], y: [400, 330], scale: [3, 4], flipX: [true, false] },
                                            ],
                                            backgroundImage: ['/assets/backgrounds/Background.png', '/assets/backgrounds/Background-1.png'],
                                            characterStates: { 'you': 'work' }
                                        },
                                        celebration: {
                                            title: "Everyone starts dancing with you.",
                                            slots: [
                                                { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: 'you', shape: 'ellipse' as const, x: 160, y: 420, scale: 3, flipX: true },
                                                { id: 'slot-4-2-2', allowedTypes: ['character'], placedItemId: 'group_citizens', shape: 'ellipse' as const, x: 575, y: 420, scale: 3 },
                                            ],
                                            backgroundImage: '/assets/backgrounds/Background.png',
                                            characterStates: { 'you': 'dance', 'group_citizens': 'dance' }
                                        },
                                        default: { title: "The End", slots: [], backgroundImage: '/assets/backgrounds/Background-5.png' }
                                    }[outcomeType];

                                    if (config) {
                                        overrideTitle = config.title;
                                        overrideSlots = config.slots;
                                        overrideBgImage = config.backgroundImage;
                                        overrideCharacterStates = config.characterStates;
                                    }
                                }
                            }

                            // Construct a temp scene object if overrides exist
                            const sceneToRender = (overrideSlots)
                                ? { ...originalScene, slots: overrideSlots, backgroundImage: overrideBgImage || originalScene.backgroundImage }
                                : originalScene;

                            return (
                                // CRITICAL: Height-based sizing to ensure it fits vertically
                                // w-auto + aspect-ratio + h-full = scaling by height
                                <div key={originalScene.id} className="h-full aspect-[4/3] w-auto max-w-[32vw] relative">
                                    <Scene
                                        scene={sceneToRender}
                                        isActive={false} // Always non-interactive for display/static scenes
                                        levelItems={currentLevel.availableItems}
                                        overrideTitle={overrideTitle}
                                        overrideCharacterStates={overrideCharacterStates}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 3: Interaction Tray (Bottom) */}
                <div className="flex-none h-[25%] min-h-[70px] w-full relative flex items-center justify-center bg-[#2c1810]/5">
                    <div className="w-full h-full flex items-center justify-center px-4 md:px-12 py-1">
                        <Tray items={availableItems} counts={trayCounts} />
                    </div>

                    {/* Level Progress Indicator / Next Button */}
                    <div className={`absolute bottom-2 right-safe-offset transition-all duration-700 ${showNextButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} z-[60]`}
                        style={{ right: 'max(1rem, env(safe-area-inset-right))', bottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
                        <button
                            onClick={handleNextLevel}
                            disabled={!showNextButton}
                            className="group bg-[#4a2c2a] hover:bg-[#5d3a37] text-amber-100 font-serif-bold px-4 md:px-8 py-2 md:py-3 rounded-sm shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 border border-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontSize: 'clamp(0.8rem, 2.5vh, 1.25rem)' }}
                        >
                            <span className="uppercase tracking-widest">{currentLevelId === 'level-4' ? 'Finish' : 'Next'}</span>
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

                {/* Ticket Modal (End of Level 4) */}
                <TicketModal isOpen={showTicketModal} onClose={handleTicketClose} />

            </div>
        </DndContext>
    );
};
