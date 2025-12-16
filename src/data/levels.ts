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
        availableItems: [ITEMS.adam, ITEMS.eve, ITEMS.tree, ITEMS.adam, ITEMS.eve],
        scenes: [
            {
                id: 'scene-1-1',
                slots: [
                    { id: 'slot-1-1-1', allowedTypes: ['character'], placedItemId: null },
                    { id: 'slot-1-1-2', allowedTypes: ['character'], placedItemId: null },
                    { id: 'slot-1-1-3', allowedTypes: ['setting'], placedItemId: null },
                ],
                description: 'The Garden of Eden'
            },
            {
                id: 'scene-1-2',
                slots: [
                    { id: 'slot-1-2-1', allowedTypes: ['character'], placedItemId: null },
                    { id: 'slot-1-2-2', allowedTypes: ['character'], placedItemId: null },
                ],
                description: 'First Meeting'
            }
        ],
        validate: (scenes: Scene[]) => {
            const results: Record<string, boolean> = {};

            // Scene 1: Needs Adam, Eve, and Tree
            const s1 = scenes.find(s => s.id === 'scene-1-1');
            if (s1) {
                const items = s1.slots.map(s => s.placedItemId);
                results[s1.id] = items.includes('adam') && items.includes('eve') && items.includes('tree');
            }

            // Scene 2: Needs Adam and Eve
            const s2 = scenes.find(s => s.id === 'scene-1-2');
            if (s2) {
                const items = s2.slots.map(s => s.placedItemId);
                results[s2.id] = items.includes('adam') && items.includes('eve');
            }

            return results;
        }
    },
    {
        id: 'level-2',
        title: 'Level 2',
        goal: 'Tragedy: Romeo and Juliet die',
        availableItems: [ITEMS.romeo, ITEMS.juliet, ITEMS.poison, ITEMS.grave],
        scenes: [
            { id: 'scene-2-1', slots: [{ id: 's2-1-1', allowedTypes: ['character'], placedItemId: null }, { id: 's2-1-2', allowedTypes: ['object'], placedItemId: null }], description: 'Romeo drinks poison' },
            { id: 'scene-2-2', slots: [{ id: 's2-2-1', allowedTypes: ['character'], placedItemId: null }, { id: 's2-2-2', allowedTypes: ['object'], placedItemId: null }], description: 'Juliet finds Romeo' }
        ],
        validate: (scenes: Scene[]) => {
            const results: Record<string, boolean> = {};

            // Scene 1: Romeo + Poison
            const s1 = scenes.find(s => s.id === 'scene-2-1');
            if (s1) {
                const items = s1.slots.map(s => s.placedItemId);
                results[s1.id] = items.includes('romeo') && items.includes('poison');
            }

            // Scene 2: Juliet + Grave (representing death/tragedy)
            const s2 = scenes.find(s => s.id === 'scene-2-2');
            if (s2) {
                const items = s2.slots.map(s => s.placedItemId);
                results[s2.id] = items.includes('juliet') && items.includes('grave');
            }

            return results;
        }
    },
];
