import { create } from 'zustand';
import type { Scene, Item } from '../types';
import { levels } from '../data/levels';

interface GameState {
    currentLevelId: string;
    currentScenes: Scene[];
    availableItems: Item[]; // Logic change: This now holds UNIQUE types for the level
    trayCounts: Record<string, number>; // New: distinct counts for items
    sceneSolvedStatus: Record<string, boolean>;
    isLevelSolved: boolean;

    // Actions
    loadLevel: (levelId: string) => void;

    // Place item from tray into a slot
    placeItemFromTray: (sceneId: string, slotId: string, itemId: string) => void;

    // Return item from a slot back to the tray
    returnItemToTray: (sceneId: string, slotId: string) => void;

    // Move item from one slot to another
    moveItem: (fromSceneId: string, fromSlotId: string, toSceneId: string, toSlotId: string) => void;

    checkWinCondition: () => void;
    resetLevel: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    currentLevelId: 'level-1',
    currentScenes: [],
    availableItems: [],
    trayCounts: {},
    sceneSolvedStatus: {},
    isLevelSolved: false,

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
                isLevelSolved: false
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
            let movedItemId: string | null = null;
            let displacedItemId: string | null = null;

            // Remove from source
            const intermediateScenes = state.currentScenes.map((scene) => {
                if (scene.id !== fromSceneId) return scene;
                return {
                    ...scene,
                    slots: scene.slots.map((slot) => {
                        if (slot.id !== fromSlotId) return slot;
                        movedItemId = slot.placedItemId;
                        return { ...slot, placedItemId: null };
                    }),
                };
            });

            if (!movedItemId) return state;

            // Add to destination
            const finalScenes = intermediateScenes.map((scene) => {
                if (scene.id !== toSceneId) return scene;
                return {
                    ...scene,
                    slots: scene.slots.map((slot) => {
                        if (slot.id !== toSlotId) return slot;

                        // If destination has an item, return to tray (swap logic implicitly)
                        if (slot.placedItemId) {
                            displacedItemId = slot.placedItemId;
                        }

                        return { ...slot, placedItemId: movedItemId };
                    }),
                };
            });

            const newCounts = { ...state.trayCounts };
            if (displacedItemId) {
                newCounts[displacedItemId] = (newCounts[displacedItemId] || 0) + 1;
            }

            return {
                currentScenes: finalScenes,
                trayCounts: newCounts
            };
        });
        get().checkWinCondition();
    },

    checkWinCondition: () => {
        const state = get();
        const level = levels.find(l => l.id === state.currentLevelId);
        if (!level || !level.validate) return;

        const results = level.validate(state.currentScenes);
        const allSolved = state.currentScenes.every(scene => results[scene.id]);

        set({
            sceneSolvedStatus: results,
            isLevelSolved: allSolved
        });

        if (allSolved) {
            console.log("Level Solved!");
        }
    },

    resetLevel: () => {
        get().loadLevel(get().currentLevelId);
    }
}));
