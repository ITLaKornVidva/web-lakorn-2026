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
    you: { id: 'you', name: 'You', type: 'character', icon: '/assets/you.png' },
    book: { id: 'book', name: 'Book', type: 'object', icon: '/assets/book.png' },
    open: { id: 'open', name: 'Open', type: 'action', icon: '/assets/open_book.png' },
};

export const levels: Level[] = [
    {
        id: 'level-1',
        title: 'Level 1',
        goal: 'You found a mysterious book that takes you to the past',
        availableItems: [ITEMS.you, ITEMS.you, ITEMS.you, ITEMS.book, ITEMS.book, ITEMS.open],
        scenes: [
            {
                id: 'scene-1-1',
                title: 'YOU FOUND A BOOK',
                slots: [
                    { id: 'slot-1-1-1', allowedTypes: ['character'], placedItemId: null, shape: 'ellipse', x: 600, y: 420, scale: 2 },
                    { id: 'slot-1-1-2', allowedTypes: ['object'], placedItemId: null, shape: 'ellipse', x: 320, y: 330, scale: 3 },
                ],
                description: 'You found a book',
                backgroundImage: '/assets/scene1_bg.png'
            },
            {
                id: 'scene-1-2',
                title: 'YOU OPENED A BOOK',
                slots: [
                    { id: 'slot-1-2-1', allowedTypes: ['character'], placedItemId: null, shape: 'ellipse', x: 200, y: 420, scale: 2 },
                    { id: 'slot-1-2-2', allowedTypes: ['action'], placedItemId: null, shape: 'rectangle', x: 400, y: 300, scale: 2 },
                    { id: 'slot-1-2-3', allowedTypes: ['object'], placedItemId: null, shape: 'ellipse', x: 600, y: 420, scale: 2 },
                ],
                description: 'You opened a book',
                backgroundImage: '/assets/scene1_bg.png'
            },
            {
                id: 'scene-1-3',
                title: 'YOU TRAVELED INTO THE PAST',
                slots: [
                    { id: 'slot-1-3-1', allowedTypes: ['character'], placedItemId: null, shape: 'ellipse', x: 400, y: 420, scale: 2 },
                ],
                description: 'You traveled into the past',
                backgroundImage: '/assets/scene1_bg.png'
            }
        ],
        validate: (scenes: Scene[]) => {
            const results: Record<string, boolean> = {};

            const s1 = scenes.find(s => s.id === 'scene-1-1');
            if (s1) {
                const items = s1.slots.map(s => s.placedItemId);
                results[s1.id] = items.includes('you') && items.includes('book');
            }

            const s2 = scenes.find(s => s.id === 'scene-1-2');
            if (s2) {
                const items = s2.slots.map(s => s.placedItemId);
                results[s2.id] = items.includes('you') && items.includes('open') && items.includes('book');
            }

            const s3 = scenes.find(s => s.id === 'scene-1-3');
            if (s3) {
                const items = s3.slots.map(s => s.placedItemId);
                results[s3.id] = items.includes('you');
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
            { id: 'scene-2-1', slots: [{ id: 'slot-2-1-1', allowedTypes: ['character'], placedItemId: null, x: 240, y: 420 }, { id: 'slot-2-1-2', allowedTypes: ['object'], placedItemId: null, x: 560, y: 420 }], description: 'Romeo drinks poison' },
            { id: 'scene-2-2', slots: [{ id: 'slot-2-2-1', allowedTypes: ['character'], placedItemId: null, x: 240, y: 420 }, { id: 'slot-2-2-2', allowedTypes: ['object'], placedItemId: null, x: 560, y: 420 }], description: 'Juliet finds Romeo' }
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
