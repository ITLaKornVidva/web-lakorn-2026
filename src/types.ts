export type ItemType = 'character' | 'setting' | 'object' | 'action';

export const SCENE_BASE_WIDTH = 800;
export const SCENE_BASE_HEIGHT = 600;

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    icon: string; // Emoji or image URL
}

export interface Slot {
    id: string;
    allowedTypes: ItemType[];
    placedItemId: string | null;
    shape?: 'ellipse' | 'rectangle';
    x: number; // pixels from left (0 to 800)
    y: number; // pixels from top (0 to 600)
    scale?: number; // scale multiplier for the item in this slot (default: 1)
}

export interface Scene {
    id: string;
    slots: Slot[];
    title?: string; // Appears above scene
    description?: string; // Appears below scene/dialogue
    backgroundImage?: string;
}

export interface Level {
    id: string;
    title: string;
    goal: string;
    scenes: Scene[];
    availableItems: Item[];
    // Logic to check if level is solved triggers in store, 
    // but we can attach a validation function here or in a separate logic file.
    // For simplicity, we might store the check logic function in the level object itself 
    // (though functions in state can be tricky with some persist middleware, 
    // but fine for just structure).
    // Returns a map of sceneId -> isSolved
    validate: (scenes: Scene[]) => Record<string, boolean>;
}
