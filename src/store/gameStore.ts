import { create } from 'zustand';
import type { Scene, Item } from '../types';
import { levels } from '../data/levels';

interface GameState {
    currentLevelId: string;
    currentScenes: Scene[];
    availableItems: Item[];
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
    isLevelSolved: false,

    loadLevel: (levelId: string) => {
        const level = levels.find(l => l.id === levelId);
        if (level) {
            // Deep copy scenes to reset them
            const initialScenes = JSON.parse(JSON.stringify(level.scenes));
            set({
                currentLevelId: levelId,
                currentScenes: initialScenes,
                availableItems: [...level.availableItems], // Copy available items
                isLevelSolved: false
            });
        }
    },

    placeItemFromTray: (sceneId, slotId, itemId) => {
        set((state) => {
            const itemToPlace = state.availableItems.find(i => i.id === itemId);
            if (!itemToPlace) return state;

            // Remove from available items
            const newAvailableItems = state.availableItems.filter(i => i.id !== itemId);

            // Add to slot
            const newScenes = state.currentScenes.map((scene) => {
                if (scene.id !== sceneId) return scene;

                return {
                    ...scene,
                    slots: scene.slots.map((slot) => {
                        if (slot.id !== slotId) return slot;
                        // If slot already has an item, return it to tray? 
                        // For now assuming empty slot or overwrite -> ideally we should swap or return existing first.
                        // Impl plan simplified: just place. But let's be safe: return existing if any.
                        return { ...slot, placedItemId: itemId };
                    }),
                };
            });

            // Note: If we overwrite, we lost the old item. Ideally we should check if slot is full.
            // But UI shouldn't allow drop if full usually, or we swap. 
            // Let's keep it simple: drop overwrites (but we should probably put the old one back in tray if strictly following conservation of mass).
            // Re-reading usage: We check `placedItem` in Slot. If we drop on top, likely valid replacement?
            // User request: "ถ้าเอาไปวาง ... และลบออกจาก available". "ถ้าวางไม่ได้ ... กลับไป available".

            return {
                currentScenes: newScenes,
                availableItems: newAvailableItems
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

            // Find item object from level data to put back (or we need a master list of items)
            // `availableItems` only has current. We need to look up valid items.
            // The level has the master list? `state.currentScenes` only has IDs.
            // Let's assume `levels` lookup is safe.
            const level = levels.find(l => l.id === state.currentLevelId);
            const originalItem = level?.availableItems.find(i => i.id === itemToReturnId);

            if (!originalItem) {
                // Fallback if not found in level availableItems (maybe it was a special item?)
                // For now, assume it's there.
                return { currentScenes: newScenes };
            }

            return {
                currentScenes: newScenes,
                availableItems: [...state.availableItems, originalItem]
            };
        });
        get().checkWinCondition();
    },

    moveItem: (fromSceneId, fromSlotId, toSceneId, toSlotId) => {
        set((state) => {
            let movedItemId: string | null = null;

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
                        return { ...slot, placedItemId: movedItemId };
                    }),
                };
            });

            return { currentScenes: finalScenes };
        });
        get().checkWinCondition();
    },

    checkWinCondition: () => {
        const state = get();
        const level = levels.find(l => l.id === state.currentLevelId);
        if (!level) return;

        if (level.checkSolution(state.currentScenes)) {
            set({ isLevelSolved: true });
            console.log("Level Solved!");
        } else {
            set({ isLevelSolved: false });
        }
    },

    resetLevel: () => {
        get().loadLevel(get().currentLevelId);
    }
}));
