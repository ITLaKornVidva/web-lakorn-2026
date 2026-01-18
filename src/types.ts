export type ItemType = 'character' | 'setting' | 'object' | 'action';

export const SCENE_BASE_WIDTH = 800;
export const SCENE_BASE_HEIGHT = 600;

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    icon: string; // Emoji or image URL
    defaultState?: string; // e.g. 'idle'
    spriteName?: string; // Base name for dynamic assets (e.g. 'a', 'player')
}

export interface Slot {
    id: string;
    allowedTypes: ItemType[];
    placedItemId: string | null;
    shape?: 'ellipse' | 'rectangle';
    x: number | number[]; // pixels from left (0 to 800) or animation frames
    y: number | number[]; // pixels from top (0 to 600) or animation frames
    scale?: number | number[]; // scale multiplier for the item in this slot (default: 1)
    flipX?: boolean | boolean[];
    flipY?: boolean | boolean[];
}

export interface Outcome {
    id: string;
    itemIds: (string | null)[]; // IDs of items in slots (order matters? or set? Usually set for this game logic based on previous turns)
    title: string;
    isSolved: boolean;
    endingImage?: string;
    characterStates?: Record<string, string>; // itemId -> state (e.g. 'dance')
}

export interface Scene {
    id: string;
    slots: Slot[];
    title?: string; // Appears above scene
    description?: string; // Appears below scene/dialogue
    backgroundImage?: string | string[];
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
