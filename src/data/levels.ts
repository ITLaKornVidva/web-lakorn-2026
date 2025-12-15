import type { Level, Item, Scene } from '../types';

const ITEMS: Record<string, Item> = {
    adam: { id: 'adam', name: 'Adam', type: 'character', icon: '👨' },
    eve: { id: 'eve', name: 'Eve', type: 'character', icon: '👩' },
    apple: { id: 'apple', name: 'Apple', type: 'object', icon: '🍎' },
    snake: { id: 'snake', name: 'Snake', type: 'character', icon: '🐍' },
    grave: { id: 'grave', name: 'Grave', type: 'object', icon: '🪦' },
    tree: { id: 'tree', name: 'Tree', type: 'setting', icon: '🌳' },
    cliff: { id: 'cliff', name: 'Cliff', type: 'setting', icon: '⛰️' },
    romeo: { id: 'romeo', name: 'Romeo', type: 'character', icon: '🤵' },
    juliet: { id: 'juliet', name: 'Juliet', type: 'character', icon: '👰' },
    poison: { id: 'poison', name: 'Poison', type: 'object', icon: '☠️' },
};

export const levels: Level[] = [
    {
        id: 'level-1',
        title: 'Level 1',
        goal: 'Adam Meets Eve',
        availableItems: [ITEMS.adam, ITEMS.eve, ITEMS.tree],
        scenes: [
            {
                id: 'scene-1-1',
                slots: [
                    { id: 'slot-1-1-1', allowedTypes: ['character'], placedItemId: null },
                    { id: 'slot-1-1-2', allowedTypes: ['character'], placedItemId: null },
                    { id: 'slot-1-1-3', allowedTypes: ['setting'], placedItemId: null },
                ],
                description: '...'
            },
            {
                id: 'scene-1-2',
                slots: [
                    { id: 'slot-1-2-1', allowedTypes: ['character'], placedItemId: null },
                    { id: 'slot-1-2-2', allowedTypes: ['character'], placedItemId: null },
                ],
                description: '...'
            }
        ],
        checkSolution: (scenes: Scene[]) => {
            // Win if Scene 1 contains Adam and Eve (in either order)
            const s1 = scenes[0];
            const items = s1.slots.map(s => s.placedItemId);
            return items.includes('adam') && items.includes('eve') && items.includes('tree');
        }
    },
    {
        id: 'level-2',
        title: 'Level 2',
        goal: 'Tragedy: Romeo and Juliet die',
        availableItems: [ITEMS.romeo, ITEMS.juliet, ITEMS.poison, ITEMS.grave],
        scenes: [
            { id: 'scene-2-1', slots: [{ id: 's2-1-1', allowedTypes: ['character'], placedItemId: null }, { id: 's2-1-2', allowedTypes: ['object'], placedItemId: null }], description: 'Intro' },
            { id: 'scene-2-2', slots: [{ id: 's2-2-1', allowedTypes: ['character'], placedItemId: null }], description: 'The End' }
        ],
        checkSolution: (scenes: Scene[]) => {
            // Very simple logic: Scene 2 must contain a grave.
            // In reality, logic would be complex state tracking (who is alive?).
            // For MVP, just checking if "Grave" is in the last scene slots.
            const lastScene = scenes[scenes.length - 1];
            const items = lastScene.slots.map(s => s.placedItemId);
            return items.includes('grave');
        }
    },
];
