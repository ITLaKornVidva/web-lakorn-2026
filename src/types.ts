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

export interface Outcome {
    id: string;
    itemIds: string[]; // IDs of items in slots (order matters? or set? Usually set for this game logic based on previous turns)
    title: string;
    isSolved: boolean;
    endingImage?: string;
}

export interface Scene {
    id: string;
    slots: Slot[];
    title?: string; // Appears above scene
    description?: string; // Appears below scene/dialogue
    backgroundImage?: string;
    outcomes?: Outcome[]; // Possible results for this scene
}

export interface Level {
    id: string;
    title: string;
    goal: string;
    scenes: Scene[];
    availableItems: Item[];
    // Legacy validation or global level validation
    validate?: (scenes: Scene[]) => Record<string, boolean>;
}
