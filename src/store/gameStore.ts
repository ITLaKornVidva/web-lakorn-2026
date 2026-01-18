import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scene, Item, Outcome } from '../types';
import { levels } from '../data/levels';

interface LevelProgress {
    placements: Record<string, string>; // slotId -> itemId
    trayCounts: Record<string, number>; // itemId -> count
}

interface GameState {
    // Persistent fields (via customization)
    playerName: string;
    characterId: string;

    // Minimal persistence state
    levelProgress: Record<string, LevelProgress>; // levelId -> progress

    // Game session state (Derived / Runtime)
    completedScenes: string[];
    solvedLevels: string[];

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

    loadLevel: (levelId: string) => void;

    // Place item from tray into a slot
    placeItemFromTray: (sceneId: string, slotId: string, itemId: string) => void;

    // Return item from a slot back to the tray
    returnItemToTray: (sceneId: string, slotId: string) => void;

    // Move item from one slot to another
    moveItem: (fromSceneId: string, fromSlotId: string, toSceneId: string, toSlotId: string) => void;

    checkWinCondition: () => void;
    recalculateAllProgress: () => void;
    resetLevel: () => void;

    resetProgress: () => void;
    // Game Completion
    isGameCompleted: boolean;
    userName: string;
    userAvatar: string;
    completeGame: () => void;
    resetGame: () => void;

    // Global Animation (500ms Tick)
    globalAnimationFrame: number;
    tickAnimation: () => void;
}

const defaultGameState = {
    playerName: '',
    characterId: 'player1',
    levelProgress: {},

    completedScenes: [],
    solvedLevels: [],

    currentLevelId: 'level-1',
    currentScenes: [],
    availableItems: [],
    trayCounts: {},
    sceneSolvedStatus: {},
    activeOutcomes: {},
    isLevelSolved: false,
    lastOutcome: null,


    // Default user info
    isGameCompleted: false,
    userName: 'Storyteller',
    userAvatar: '🧙‍♂️',
    globalAnimationFrame: 0,
};


export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            ...defaultGameState,

            setPlayerName: (name: string) => set({ playerName: name }),

            setCharacterId: (id: string) => set({ characterId: id }),

            tickAnimation: () => set(state => ({ globalAnimationFrame: state.globalAnimationFrame + 1 })),

            loadLevel: (levelId: string) => {
                const level = levels.find(l => l.id === levelId);
                if (!level) return;

                const { levelProgress } = get();
                const savedProgress = levelProgress[levelId];

                // 1. Clean verify/clone from definitive levels.ts
                const initialScenes: Scene[] = JSON.parse(JSON.stringify(level.scenes));

                // 2. Default Counts
                let initialCounts: Record<string, number> = {};
                const uniqueItems: Item[] = [];

                level.availableItems.forEach(item => {
                    if (!initialCounts[item.id]) {
                        initialCounts[item.id] = 0;
                        uniqueItems.push(item);
                    }
                    initialCounts[item.id]++;
                });

                // 3. Apply Saved State if exists
                if (savedProgress) {
                    // Apply Placements
                    initialScenes.forEach(scene => {
                        scene.slots.forEach(slot => {
                            const savedItemId = savedProgress.placements[slot.id];
                            if (savedItemId) {
                                slot.placedItemId = savedItemId;
                            }
                        });
                    });

                    // Use Saved Tray Counts - CRITICAL: User requested explicit storage of tray counts
                    initialCounts = { ...initialCounts, ...savedProgress.trayCounts };
                }

                set({
                    currentLevelId: levelId,
                    currentScenes: initialScenes,
                    availableItems: uniqueItems,
                    trayCounts: initialCounts,
                    sceneSolvedStatus: {},
                    activeOutcomes: {},
                    isLevelSolved: false,
                    lastOutcome: null
                });

                // 4. Check status immediately on load
                get().checkWinCondition();
            },

            placeItemFromTray: (sceneId, slotId, itemId) => {
                set((state) => {
                    if ((state.trayCounts[itemId] || 0) <= 0) return state;

                    const newCounts = { ...state.trayCounts };
                    newCounts[itemId]--;

                    const newScenes = state.currentScenes.map((scene) => {
                        if (scene.id !== sceneId) return scene;
                        return {
                            ...scene,
                            slots: scene.slots.map((slot) => {
                                if (slot.id !== slotId) return slot;
                                if (slot.placedItemId) {
                                    newCounts[slot.placedItemId] = (newCounts[slot.placedItemId] || 0) + 1;
                                }
                                return { ...slot, placedItemId: itemId };
                            }),
                        };
                    });

                    // Update Persistence
                    const currentPlacements = state.levelProgress[state.currentLevelId]?.placements || {};
                    const newPlacements = { ...currentPlacements, [slotId]: itemId };

                    const newLevelProgress = {
                        ...state.levelProgress,
                        [state.currentLevelId]: {
                            placements: newPlacements,
                            trayCounts: newCounts
                        }
                    };

                    return {
                        currentScenes: newScenes,
                        trayCounts: newCounts,
                        levelProgress: newLevelProgress
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

                    // Update Persistence
                    const currentPlacements = { ...state.levelProgress[state.currentLevelId]?.placements };
                    if (currentPlacements) {
                        delete currentPlacements[slotId];
                    }

                    const newLevelProgress = {
                        ...state.levelProgress,
                        [state.currentLevelId]: {
                            placements: currentPlacements || {},
                            trayCounts: newCounts
                        }
                    };

                    return {
                        currentScenes: newScenes,
                        trayCounts: newCounts,
                        levelProgress: newLevelProgress
                    };
                });
                get().checkWinCondition();
            },

            moveItem: (fromSceneId, fromSlotId, toSceneId, toSlotId) => {
                set((state) => {
                    let movingItemId: string | null = null;
                    let targetItemId: string | null = null;

                    state.currentScenes.forEach(scene => {
                        scene.slots.forEach(slot => {
                            if (scene.id === fromSceneId && slot.id === fromSlotId) movingItemId = slot.placedItemId;
                            if (scene.id === toSceneId && slot.id === toSlotId) targetItemId = slot.placedItemId;
                        });
                    });

                    if (!movingItemId) return state;

                    const newScenes = state.currentScenes.map((scene) => ({
                        ...scene,
                        slots: scene.slots.map((slot) => {
                            if (scene.id === toSceneId && slot.id === toSlotId) return { ...slot, placedItemId: movingItemId };
                            if (scene.id === fromSceneId && slot.id === fromSlotId) return { ...slot, placedItemId: targetItemId }; // swap
                            return slot;
                        }),
                    }));

                    // Update Persistence
                    const currentPlacements = { ...state.levelProgress[state.currentLevelId]?.placements || {} };
                    if (movingItemId) currentPlacements[toSlotId] = movingItemId;
                    // Handle swap (targetItemId moves to fromSlot)
                    if (targetItemId) {
                        currentPlacements[fromSlotId] = targetItemId;
                    } else {
                        delete currentPlacements[fromSlotId];
                    }

                    const newLevelProgress = {
                        ...state.levelProgress,
                        [state.currentLevelId]: {
                            placements: currentPlacements,
                            trayCounts: state.trayCounts // Tray counts don't change on move
                        }
                    };

                    return {
                        currentScenes: newScenes,
                        levelProgress: newLevelProgress,
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

                // Phase 1: Check `outcomes` from levels.ts
                const levelScenesDef = level.scenes;

                state.currentScenes.forEach((sceneState) => {
                    // Start fresh
                    results[sceneState.id] = false;
                    activeOutcomes[sceneState.id] = null;

                    // Match with definition
                    const sceneDef = levelScenesDef.find(s => s.id === sceneState.id);
                    if (sceneDef && sceneDef.outcomes && sceneDef.outcomes.length > 0) {
                        const placedItems = sceneState.slots.map(s => s.placedItemId); // Current State

                        const match = sceneDef.outcomes.find(outcome =>
                            JSON.stringify(placedItems) === JSON.stringify(outcome.itemIds)
                        );

                        if (match) {
                            results[sceneState.id] = match.isSolved;
                            activeOutcomes[sceneState.id] = match;
                            if (match.isSolved) foundOutcome = match;
                        }
                    }
                });

                // Phase 2: Legacy validate
                if (level.validate) {
                    const legacyResults = level.validate(state.currentScenes); // Pass state scenes for slot content
                    Object.assign(results, legacyResults);
                }

                const allSolved = state.currentScenes.every(scene => results[scene.id]);

                // Update completedScenes (Derived)
                const newCompletedScenes = state.completedScenes.filter(id => {
                    const isCurrentLevelScene = state.currentScenes.some(s => s.id === id);
                    return !isCurrentLevelScene;
                });
                state.currentScenes.forEach(scene => {
                    if (results[scene.id]) newCompletedScenes.push(scene.id);
                });

                // Update solvedLevels
                let newSolvedLevels = [...state.solvedLevels];
                if (allSolved && !newSolvedLevels.includes(state.currentLevelId)) {
                    newSolvedLevels.push(state.currentLevelId);
                }

                set((current) => ({
                    sceneSolvedStatus: results,
                    activeOutcomes: activeOutcomes,
                    isLevelSolved: allSolved,
                    lastOutcome: foundOutcome || current.lastOutcome,
                    completedScenes: newCompletedScenes,
                    solvedLevels: newSolvedLevels
                }));

                if (allSolved) {
                    console.log("Level Solved!");
                }
            },

            resetLevel: () => {
                // Clear progress for this level
                set((state) => {
                    const newLevelProgress = { ...state.levelProgress };
                    delete newLevelProgress[state.currentLevelId];
                    return { levelProgress: newLevelProgress };
                });
                // Reload
                get().loadLevel(get().currentLevelId);
            },

            resetProgress: () => {
                set({
                    playerName: '',
                    characterId: '',
                    levelProgress: {},

                    completedScenes: [],
                    solvedLevels: [],
                    currentLevelId: 'level-1',
                    currentScenes: [],
                    availableItems: [],
                    trayCounts: {},
                    sceneSolvedStatus: {},
                    isLevelSolved: false,
                    lastOutcome: null,
                });
            },

            recalculateAllProgress: () => {
                const state = get();
                const { levelProgress } = state;
                const newCompletedScenes: string[] = [];
                const newSolvedLevels: string[] = [];

                levels.forEach(level => {
                    const savedProgress = levelProgress[level.id];
                    // Even if no saved progress, we might want to check if it's auto-solved? 
                    // Unlikely for this game type, but let's stick to saved progress for now 
                    // essentially if we have touched it.
                    if (!savedProgress) return;

                    // Reconstruct scenes for validation (lightweight)
                    const reconstruction = level.scenes.map(sceneDef => {
                        const savedScene = { ...sceneDef, slots: sceneDef.slots.map(s => ({ ...s })) }; // shallow clone structure needed
                        savedScene.slots.forEach(slot => {
                            if (savedProgress.placements[sceneDef.id + "-" + slot.id.split('-').slice(1).join('-')] || savedProgress.placements[slot.id]) {
                                savedScene.slots.forEach(s => {
                                    if (s.id === slot.id) s.placedItemId = savedProgress.placements[sceneDef.id + "-" + slot.id.split('-').slice(1).join('-')] || savedProgress.placements[slot.id];
                                });
                            }
                        });
                        // Actually the loop above is slightly wrong on the find.
                        // Let's do it cleaner:

                        const activeSlots = savedScene.slots.map(slot => ({
                            ...slot,
                            placedItemId: savedProgress.placements[slot.id] || null
                        }));
                        return { ...savedScene, slots: activeSlots };
                    });

                    // Validate
                    let allScenesSolved = true;

                    reconstruction.forEach(sceneState => {
                        let isSceneSolved = false;

                        // Phase 1: Outcomes
                        if (sceneState.outcomes && sceneState.outcomes.length > 0) {
                            const placedItems = sceneState.slots.map(s => s.placedItemId);
                            const match = sceneState.outcomes.find(outcome =>
                                JSON.stringify(placedItems) === JSON.stringify(outcome.itemIds)
                            );
                            if (match && match.isSolved) isSceneSolved = true;
                        }

                        // Phase 2: Legacy
                        // level.validate expects State scenes. 
                        // Note: level.validate might depend on cross-scene state.

                        if (isSceneSolved) {
                            if (!newCompletedScenes.includes(sceneState.id)) newCompletedScenes.push(sceneState.id);
                        } else {
                            // Only fail if not solved by legacy either.
                        }
                    });

                    // For legacy validate function which returns Record<sceneId, boolean>
                    if (level.validate) {
                        // It expects `Scene[]`. reconstruction is `Scene[]` (duck typed).
                        // Need to cast or ensuring types match. `Scene` interface in types.ts.
                        // `reconstruction` has slots with placedItemId. Matches.
                        const legacyResults = level.validate(reconstruction as Scene[]);
                        Object.entries(legacyResults).forEach(([sceneId, solved]) => {
                            if (solved) {
                                if (!newCompletedScenes.includes(sceneId)) newCompletedScenes.push(sceneId);
                            }
                        });
                    }

                    // Check if entire level is solved
                    // Re-check all scenes in this level
                    allScenesSolved = reconstruction.every(scene =>
                        newCompletedScenes.includes(scene.id)
                    );

                    if (allScenesSolved) {
                        newSolvedLevels.push(level.id);
                    }
                });

                set({
                    completedScenes: newCompletedScenes,
                    solvedLevels: newSolvedLevels
                });
            },

            completeGame: () => {
                set({ isGameCompleted: true });
            },

            resetGame: () => {
                set({ isGameCompleted: false });
                get().loadLevel('level-1');
            }
        }),
        {
            name: 'lakorn-game-storage',
            partialize: (state) => ({
                playerName: state.playerName,
                characterId: state.characterId,
                levelProgress: state.levelProgress,
                solvedLevels: state.solvedLevels,
                completedScenes: state.completedScenes,
                isGameCompleted: state.isGameCompleted,
                activeOutcomes: state.activeOutcomes,
            }),
            onRehydrateStorage: () => (state) => {
                state?.recalculateAllProgress();
            },
        }
    )
);
