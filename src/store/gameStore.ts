import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scene, Item, Outcome } from '../types';
import { levels } from '../data/levels';

interface GameState {
    // Persistent fields
    playerName: string;
    characterId: string;
    // unlockedLevels removed

    completedScenes: string[];
    levelPlacements: Record<string, Scene[]>;
    solvedLevels: string[];

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
    // unlockLevel action removed

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
    // unlockedLevels removed

    completedScenes: [],
    levelPlacements: {},
    solvedLevels: [],
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

            // unlockLevel action removed


            markSceneCompleted: (sceneId: string) => {
                const { completedScenes } = get();
                if (!completedScenes.includes(sceneId)) {
                    set({ completedScenes: [...completedScenes, sceneId] });
                }
            },

            loadLevel: (levelId: string) => {
                const level = levels.find(l => l.id === levelId);
                const { levelPlacements } = get();

                if (level) {
                    // 1. Try to load from saved placements
                    let initialScenes: Scene[];
                    const savedScenes = levelPlacements[levelId];

                    if (savedScenes) {
                        initialScenes = JSON.parse(JSON.stringify(savedScenes));
                    } else {
                        // 2. Fallback to default
                        initialScenes = JSON.parse(JSON.stringify(level.scenes));
                    }

                    // 3. Calculate initial counts
                    const counts: Record<string, number> = {};
                    const uniqueItems: Item[] = [];

                    // Initialize max stock
                    level.availableItems.forEach(item => {
                        if (!counts[item.id]) {
                            counts[item.id] = 0;
                            uniqueItems.push(item);
                        }
                        counts[item.id]++;
                    });

                    // Subtract placed items if they were loaded from storage
                    // Ideally we should always subtract placed items to be safe
                    initialScenes.forEach(scene => {
                        scene.slots.forEach(slot => {
                            if (slot.placedItemId) {
                                if (counts[slot.placedItemId] !== undefined) {
                                    counts[slot.placedItemId] = Math.max(0, counts[slot.placedItemId] - 1);
                                }
                            }
                        });
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

                    get().checkWinCondition();
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

                    // Sync to persistent storage
                    const newLevelPlacements = {
                        ...state.levelPlacements,
                        [state.currentLevelId]: newScenes
                    };

                    return {
                        currentScenes: newScenes,
                        trayCounts: newCounts,
                        levelPlacements: newLevelPlacements
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

                    // Sync to persistent storage
                    const newLevelPlacements = {
                        ...state.levelPlacements,
                        [state.currentLevelId]: newScenes
                    };

                    return {
                        currentScenes: newScenes,
                        trayCounts: newCounts,
                        levelPlacements: newLevelPlacements
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
                    // Sync to persistent storage
                    const newLevelPlacements = {
                        ...state.levelPlacements,
                        [state.currentLevelId]: finalScenes
                    };

                    return {
                        currentScenes: finalScenes,
                        levelPlacements: newLevelPlacements,
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

                // Update completedScenes (dynamic list of CURRENTLY solved scenes)
                // Filter out current level scenes first to avoid duplicates or stale state
                const newCompletedScenes = state.completedScenes.filter(id => {
                    const isCurrentLevelScene = state.currentScenes.some(s => s.id === id);
                    return !isCurrentLevelScene;
                });

                // Add back currently solved scenes
                state.currentScenes.forEach(scene => {
                    if (results[scene.id]) {
                        newCompletedScenes.push(scene.id);
                    }
                });

                // Update solvedLevels (Sticky progress)
                let newSolvedLevels = [...state.solvedLevels];
                if (allSolved && !newSolvedLevels.includes(state.currentLevelId)) {
                    newSolvedLevels.push(state.currentLevelId);
                }

                set((current) => ({
                    sceneSolvedStatus: results,
                    activeOutcomes: activeOutcomes,
                    isLevelSolved: allSolved,
                    // Persist last solved outcome if found
                    lastOutcome: foundOutcome || current.lastOutcome,
                    completedScenes: newCompletedScenes,
                    solvedLevels: newSolvedLevels
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
                    // unlockedLevels removed

                    completedScenes: [],
                    levelPlacements: {},
                    solvedLevels: [],
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
                // unlockedLevels removed

                completedScenes: state.completedScenes,
                currentLevelId: state.currentLevelId,
                levelPlacements: state.levelPlacements,
                solvedLevels: state.solvedLevels,
            }),
        }
    )
);
