import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scene, Item, Outcome } from '../types';
import { levels } from '../data/levels';

interface GameState {
    // Persistent fields
    playerName: string;
    characterId: string;
    unlockedLevels: string[];
    completedScenes: string[];

    // Game session state
    currentLevelId: string;
    currentScenes: Scene[];
    availableItems: Item[];
    trayCounts: Record<string, number>;
    sceneSolvedStatus: Record<string, boolean>;
    activeOutcomes: Record<string, Outcome | null>;
    isLevelSolved: boolean;
    lastOutcome: Outcome | null;

    // Actions
    setPlayerName: (name: string) => void;
    setCharacterId: (id: string) => void;
    unlockLevel: (levelId: string) => void;
    markSceneCompleted: (sceneId: string) => void;
    loadLevel: (levelId: string) => void;

    // Place item from tray into a slot
    placeItemFromTray: (sceneId: string, slotId: string, itemId: string) => void;

    // Return item from a slot back to the tray
    returnItemToTray: (sceneId: string, slotId: string) => void;

    // Move item from one slot to another
    moveItem: (fromSceneId: string, fromSlotId: string, toSceneId: string, toSlotId: string) => void;

    checkWinCondition: () => void;
    resetLevel: () => void;
    resetProgress: () => void;
}

const defaultGameState = {
    playerName: '',
    characterId: '',
    unlockedLevels: ['level-1'], // Level 1 unlocked by default
    completedScenes: [],
    currentLevelId: 'level-1',
    currentScenes: [],
    availableItems: [],
    trayCounts: {},
    sceneSolvedStatus: {},
    activeOutcomes: {},
    isLevelSolved: false,
    lastOutcome: null,
};



export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            ...defaultGameState,

            setPlayerName: (name: string) => set({ playerName: name }),

            setCharacterId: (id: string) => set({ characterId: id }),

            unlockLevel: (levelId: string) => {
                const { unlockedLevels } = get();
                if (!unlockedLevels.includes(levelId)) {
                    set({ unlockedLevels: [...unlockedLevels, levelId] });
                }
            },

            markSceneCompleted: (sceneId: string) => {
                const { completedScenes } = get();
                if (!completedScenes.includes(sceneId)) {
                    set({ completedScenes: [...completedScenes, sceneId] });
                }
            },

            loadLevel: (levelId: string) => {
                const level = levels.find(l => l.id === levelId);
                if (level) {
                    // Deep copy scenes to reset them
                    const initialScenes = JSON.parse(JSON.stringify(level.scenes));

                    // Calculate initial counts from level.availableItems (which may contain duplicates)
                    const counts: Record<string, number> = {};
                    const uniqueItems: Item[] = [];

                    level.availableItems.forEach(item => {
                        if (!counts[item.id]) {
                            counts[item.id] = 0;
                            uniqueItems.push(item);
                        }
                        counts[item.id]++;
                    });

                    set({
                        currentLevelId: levelId,
                        currentScenes: initialScenes,
                        availableItems: uniqueItems,
                        trayCounts: counts,
                        sceneSolvedStatus: {},
                        activeOutcomes: {},
                        isLevelSolved: false,
                        lastOutcome: null
                    });
                }
            },

            placeItemFromTray: (sceneId, slotId, itemId) => {
                set((state) => {
                    // Check if we have stock
                    if ((state.trayCounts[itemId] || 0) <= 0) return state;

                    // Decrement count
                    const newCounts = { ...state.trayCounts };
                    newCounts[itemId]--;

                    // Add to slot
                    const newScenes = state.currentScenes.map((scene) => {
                        if (scene.id !== sceneId) return scene;

                        return {
                            ...scene,
                            slots: scene.slots.map((slot) => {
                                if (slot.id !== slotId) return slot;
                                // If slot already has an item, return it to tray
                                if (slot.placedItemId) {
                                    newCounts[slot.placedItemId] = (newCounts[slot.placedItemId] || 0) + 1;
                                }
                                return { ...slot, placedItemId: itemId };
                            }),
                        };
                    });

                    return {
                        currentScenes: newScenes,
                        trayCounts: newCounts
                    };
                });
                get().checkWinCondition();
            },

            returnItemToTray: (sceneId, slotId) => {
                set((state) => {
                    let itemToReturnId: string | null = null;

                    const newScenes = state.currentScenes.map((scene) => {
                        if (scene.id !== sceneId) return scene;

                        return {
                            ...scene,
                            slots: scene.slots.map((slot) => {
                                if (slot.id !== slotId) return slot;
                                itemToReturnId = slot.placedItemId;
                                return { ...slot, placedItemId: null };
                            }),
                        };
                    });

                    if (!itemToReturnId) return state;

                    const newCounts = { ...state.trayCounts };
                    newCounts[itemToReturnId] = (newCounts[itemToReturnId] || 0) + 1;

                    return {
                        currentScenes: newScenes,
                        trayCounts: newCounts
                    };
                });
                get().checkWinCondition();
            },

            moveItem: (fromSceneId, fromSlotId, toSceneId, toSlotId) => {
                set((state) => {
                    // 1. Identify items involved
                    let movingItemId: string | null = null;
                    let targetItemId: string | null = null;

                    // Locate items without mutating yet
                    state.currentScenes.forEach(scene => {
                        scene.slots.forEach(slot => {
                            if (scene.id === fromSceneId && slot.id === fromSlotId) {
                                movingItemId = slot.placedItemId;
                            }
                            if (scene.id === toSceneId && slot.id === toSlotId) {
                                targetItemId = slot.placedItemId;
                            }
                        });
                    });

                    if (!movingItemId) return state; // Nothing to move

                    // 2. Perform the swap
                    const finalScenes = state.currentScenes.map((scene) => {
                        return {
                            ...scene,
                            slots: scene.slots.map((slot) => {
                                // Destination Slot: Receives the moving item
                                if (scene.id === toSceneId && slot.id === toSlotId) {
                                    return { ...slot, placedItemId: movingItemId };
                                }
                                // Origin Slot: Receives the target item (if any), effectively swapping
                                if (scene.id === fromSceneId && slot.id === fromSlotId) {
                                    return { ...slot, placedItemId: targetItemId };
                                }
                                return slot;
                            }),
                        };
                    });

                    // 3. Update state (Tray counts are unaffected by swapping)
                    return {
                        currentScenes: finalScenes,
                    };
                });
                get().checkWinCondition();
            },

            checkWinCondition: () => {
                const state = get();
                const level = levels.find(l => l.id === state.currentLevelId);
                if (!level) return;
                const results: Record<string, boolean> = {};
                const activeOutcomes: Record<string, Outcome | null> = {};
                let foundOutcome: Outcome | null = null;

                // Phase 1: Check `outcomes` for per-scene UI feedback and initial status
                state.currentScenes.forEach(scene => {
                    // Default to no outcome/not solved
                    results[scene.id] = false;
                    activeOutcomes[scene.id] = null;

                    if (scene.outcomes && scene.outcomes.length > 0) {
                        const placedItems = scene.slots.map(s => s.placedItemId);

                        // Match using JSON.stringify for strict equality (position matters)
                        const match = scene.outcomes.find(outcome =>
                            JSON.stringify(placedItems) === JSON.stringify(outcome.itemIds)
                        );

                        if (match) {
                            results[scene.id] = match.isSolved;
                            activeOutcomes[scene.id] = match;

                            if (match.isSolved) {
                                foundOutcome = match;
                            }
                        }
                    }
                });

                // Phase 2: Apply legacy `validate` function (Global/Complex Logic Overrides)
                if (level.validate) {
                    const legacyResults = level.validate(state.currentScenes);
                    Object.assign(results, legacyResults);
                }

                const allSolved = state.currentScenes.every(scene => results[scene.id]);

                set((current) => ({
                    sceneSolvedStatus: results,
                    activeOutcomes: activeOutcomes,
                    isLevelSolved: allSolved,
                    // Persist last solved outcome if found
                    lastOutcome: foundOutcome || current.lastOutcome
                }));

                if (allSolved) {
                    console.log("Level Solved!");
                }
            },

            resetLevel: () => {
                get().loadLevel(get().currentLevelId);
            },

            resetProgress: () => {
                set({
                    playerName: '',
                    characterId: '',
                    unlockedLevels: ['level-1'],
                    completedScenes: [],
                    currentLevelId: 'level-1',
                    currentScenes: [],
                    availableItems: [],
                    trayCounts: {},
                    sceneSolvedStatus: {},
                    isLevelSolved: false,
                });
            }
        }),
        {
            name: 'lakorn-game-storage',
            partialize: (state) => ({
                playerName: state.playerName,
                characterId: state.characterId,
                unlockedLevels: state.unlockedLevels,
                completedScenes: state.completedScenes,
                currentLevelId: state.currentLevelId,
            }),
        }
    )
);
