export type ItemType = 'character' | 'setting' | 'object';

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
}

export interface Scene {
    id: string;
    slots: Slot[];
    description?: string; // e.g. "Love Blooms"
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
