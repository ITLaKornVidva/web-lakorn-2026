import type { Level, Item } from '../types';

const ITEMS: Record<string, Item> = {
    // Characters
    you: { id: 'you', name: 'You', type: 'character', icon: '/assets/characters/player1_idle.png', spriteName: 'player', defaultState: 'idle' },
    citizen_a: { id: 'citizen_a', name: 'Citizen A', type: 'character', icon: '/assets/characters/a_idle.png', spriteName: 'a', defaultState: 'idle' },
    citizen_b: { id: 'citizen_b', name: 'Citizen B', type: 'character', icon: '/assets/characters/b_idle.png', spriteName: 'b', defaultState: 'idle' },
    citizen_c: { id: 'citizen_c', name: 'Citizen C', type: 'character', icon: '/assets/characters/c_idle.png', spriteName: 'c', defaultState: 'idle' },
    citizen_d: { id: 'citizen_d', name: 'Citizen D', type: 'character', icon: '/assets/characters/d_idle.png', spriteName: 'd', defaultState: 'idle' },
    group_citizens: { id: 'group_citizens', name: 'Citizens', type: 'character', icon: '/assets/characters/group_idle.png', spriteName: 'group', defaultState: 'idle' },

    // Objects
    book: { id: 'book', name: 'Book', type: 'object', icon: '/assets/book.png' },

    // Actions
    open: { id: 'open', name: 'Open', type: 'action', icon: 'OPEN' },
    greet: { id: 'greet', name: 'Greet', type: 'action', icon: 'GREET' },
    interest: { id: 'interest', name: 'Interest', type: 'action', icon: 'INTEREST' },
    work: { id: 'work', name: 'Work', type: 'action', icon: 'WORK' },
    dance: { id: 'dance', name: 'Dance', type: 'action', icon: 'DANCE' },
    special: { id: 'special', name: 'Special', type: 'action', icon: 'SPECIAL' },
};

export const levels: Level[] = [
    // -------------------------------------------------------------------------
    // LEVEL 1: You Found
    // -------------------------------------------------------------------------
    {
        id: 'level-1',
        title: 'Level 1',
        goal: 'YOU FOUND A MYSTERIOUS BOOK THAT TAKES YOU TO THE PAST',
        availableItems: [ITEMS.you, ITEMS.you, ITEMS.you, ITEMS.book, ITEMS.book, ITEMS.open],
        scenes: [
            {
                id: 'scene-1-1',
                slots: [
                    { id: 'slot-1-1-1', allowedTypes: ['character'], placedItemId: null, x: 160, y: 350, scale: 3, flipX: true },
                    { id: 'slot-1-1-2', allowedTypes: ['object'], placedItemId: null, x: 550, y: 360, scale: 3.5, flipX: true },
                ],
                backgroundImage: '/assets/backgrounds/Background-3.png',
                outcomes: [
                    {
                        id: 'outcome-1-1-solved',
                        itemIds: ['you', 'book'],
                        title: 'You found a book',
                        isSolved: true,
                        characterStates: { 'you': 'awe' }
                    }
                ]
            },
            {
                id: 'scene-1-2',
                slots: [
                    { id: 'slot-1-2-1', allowedTypes: ['character'], placedItemId: null, x: 160, y: 350, scale: 3, flipX: true },
                    { id: 'slot-1-2-2', allowedTypes: ['action'], placedItemId: null, x: 350, y: 150, scale: 2 },
                    { id: 'slot-1-2-3', allowedTypes: ['object'], placedItemId: null, x: 550, y: 360, scale: 3.5 },
                ],
                backgroundImage: '/assets/backgrounds/Background-3.png',
                outcomes: [
                    {
                        id: 'outcome-1-2-solved',
                        itemIds: ['you', 'open', 'book'],
                        title: 'You opened a book',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    }
                ]
            },
            {
                id: 'scene-1-3',
                slots: [
                    { id: 'slot-1-3-1', allowedTypes: ['character'], placedItemId: null, x: 350, y: 350, scale: 3 },
                ],
                backgroundImage: '/assets/backgrounds/Background-2.png',
                outcomes: [
                    {
                        id: 'outcome-1-3-solved',
                        itemIds: ['you'],
                        title: 'You traveled into the past',
                        isSolved: true,
                        characterStates: { 'you': 'awe' }
                    }
                ]
            }
        ],

    },

    // -------------------------------------------------------------------------
    // LEVEL 2: You Visit
    // -------------------------------------------------------------------------
    {
        id: 'level-2',
        title: 'Level 2',
        goal: 'YOU VISIT THE CITY WITH YOUR NEW FRIEND',
        availableItems: [ITEMS.you, ITEMS.you, ITEMS.citizen_a, ITEMS.citizen_a, ITEMS.group_citizens, ITEMS.work, ITEMS.interest, ITEMS.greet],
        scenes: [
            {
                id: 'scene-2-1',
                slots: [
                    { id: 'slot-2-1-1', allowedTypes: ['character'], placedItemId: null, x: 160, y: 350, scale: 3, flipX: true },
                    { id: 'slot-2-1-2', allowedTypes: ['action'], placedItemId: null, x: 350, y: 150, scale: 2 },
                    { id: 'slot-2-1-3', allowedTypes: ['character'], placedItemId: null, x: 575, y: 350, scale: 3 },
                ],
                backgroundImage: '/assets/backgrounds/Background-2.png',
                outcomes: [
                    {
                        id: 'outcome-2-1-solved',
                        itemIds: ['you', 'greet', 'citizen_a'],
                        title: 'You met Citizen A for the first time and you greet each other',
                        isSolved: true,
                        characterStates: { 'you': 'greet', 'citizen_a': 'greet' }
                    },
                    {
                        id: 'outcome-2-1-solved-reverse',
                        itemIds: ['citizen_a', 'greet', 'you'],
                        title: 'You met Citizen A for the first time and you greet each other',
                        isSolved: true,
                        characterStates: { 'you': 'greet', 'citizen_a': 'greet' }
                    }
                ]
            },
            {
                id: 'scene-2-2',
                slots: [
                    { id: 'slot-2-2-1', allowedTypes: ['character'], placedItemId: null, x: 160, y: 350, scale: 3, flipX: true },
                    { id: 'slot-2-2-2', allowedTypes: ['character'], placedItemId: null, x: 575, y: 350, scale: 3 },
                    { id: 'slot-2-2-3', allowedTypes: ['action'], placedItemId: null, x: 350, y: 150, scale: 2 },
                ],
                backgroundImage: '/assets/backgrounds/Background-4.png',
                outcomes: [
                    {
                        id: 'outcome-2-2-solved',
                        itemIds: ['you', 'citizen_a', 'interest'],
                        title: 'Citizen A takes you to new place and you are interested in this city',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'citizen_a': 'greet' }
                    },
                    {
                        id: 'outcome-2-2-solved-reverse',
                        itemIds: ['citizen_a', 'you', 'interest'],
                        title: 'Citizen A takes you to new place and you are interested in this city',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'citizen_a': 'greet' }
                    }
                ]
            },
            {
                id: 'scene-2-3',
                slots: [
                    { id: 'slot-2-3-1', allowedTypes: ['character'], placedItemId: null, x: 350, y: 420, scale: 3 },
                    { id: 'slot-2-3-2', allowedTypes: ['action'], placedItemId: null, x: 350, y: 150, scale: 2 },
                ],
                backgroundImage: '/assets/backgrounds/Background.png',
                outcomes: [
                    {
                        id: 'outcome-2-3-solved',
                        itemIds: ['group_citizens', 'work'],
                        title: 'Citizen A takes you to the workspace and everyone is walking into the factory',
                        isSolved: true
                    }
                ]
            }
        ],

    },

    // -------------------------------------------------------------------------
    // LEVEL 3: People In
    // -------------------------------------------------------------------------
    {
        id: 'level-3',
        title: 'Level 3',
        goal: 'PEOPLE IN THIS CITY ARE VERY HARDWORKING',
        availableItems: [
            ITEMS.citizen_b,
            ITEMS.citizen_c,
            ITEMS.citizen_d,
            ITEMS.work, ITEMS.work, ITEMS.work,
            ITEMS.special, ITEMS.special, ITEMS.special
        ],
        scenes: [
            {
                id: 'scene-3-1',
                slots: [
                    { id: 'slot-3-1-1', allowedTypes: ['character'], placedItemId: null, x: 350, y: 420, scale: 3 },
                    { id: 'slot-3-1-2', allowedTypes: ['action'], placedItemId: null, x: 350, y: 150, scale: 2 },
                ],
                backgroundImage: '/assets/backgrounds/Background.png',
                outcomes: [
                    {
                        id: 'outcome-3-1-b',
                        itemIds: ['citizen_b', 'work'],
                        title: 'CITIZEN B WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'work' }
                    },
                    {
                        id: 'outcome-3-1-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'CITIZEN C WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'work' }
                    },
                    {
                        id: 'outcome-3-1-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'CITIZEN D WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'work' }
                    },
                    {
                        id: 'outcome-3-1-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'CITIZEN B IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'dance' }
                    },
                    {
                        id: 'outcome-3-1-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'CITIZEN C IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'dance' }
                    },
                    {
                        id: 'outcome-3-1-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'CITIZEN D IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'dance' }
                    }
                ]
            },
            {
                id: 'scene-3-2',
                slots: [
                    { id: 'slot-3-2-1', allowedTypes: ['character'], placedItemId: null, x: 350, y: 420, scale: 3 },
                    { id: 'slot-3-2-2', allowedTypes: ['action'], placedItemId: null, x: 350, y: 150, scale: 2 },
                ],
                backgroundImage: '/assets/backgrounds/Background.png',
                outcomes: [
                    {
                        id: 'outcome-3-2-b',
                        itemIds: ['citizen_b', 'work'],
                        title: 'CITIZEN B WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'work' }
                    },
                    {
                        id: 'outcome-3-2-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'CITIZEN C WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'work' }
                    },
                    {
                        id: 'outcome-3-2-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'CITIZEN D WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'work' }
                    },
                    {
                        id: 'outcome-3-2-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'CITIZEN B IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'dance' }
                    },
                    {
                        id: 'outcome-3-2-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'CITIZEN C IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'dance' }
                    },
                    {
                        id: 'outcome-3-2-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'CITIZEN D IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'dance' }
                    }
                ]
            },
            {
                id: 'scene-3-3',
                slots: [
                    { id: 'slot-3-3-1', allowedTypes: ['character'], placedItemId: null, x: 350, y: 420, scale: 3 },
                    { id: 'slot-3-3-2', allowedTypes: ['action'], placedItemId: null, x: 350, y: 150, scale: 2 },
                ],
                backgroundImage: '/assets/backgrounds/Background.png',
                outcomes: [
                    {
                        id: 'outcome-3-3-b',
                        itemIds: ['citizen_b', 'work'],
                        title: 'CITIZEN B WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'work' }
                    },
                    {
                        id: 'outcome-3-3-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'CITIZEN C WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'work' }
                    },
                    {
                        id: 'outcome-3-3-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'CITIZEN D WORKS VERY HARD',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'work' }
                    },
                    {
                        id: 'outcome-3-3-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'CITIZEN B IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'dance' }
                    },
                    {
                        id: 'outcome-3-3-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'CITIZEN C IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'dance' }
                    },
                    {
                        id: 'outcome-3-3-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'CITIZEN D IS DANCING',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'dance' }
                    }
                ]
            }
        ],

    },

    // -------------------------------------------------------------------------
    // LEVEL 4: The Final Chapter
    // -------------------------------------------------------------------------
    {
        id: 'level-4',
        title: 'Level 4',
        goal: 'The Final Chapter',
        availableItems: [
            ITEMS.you, ITEMS.you,
            ITEMS.book,
            ITEMS.group_citizens,
            ITEMS.open, ITEMS.open,
            ITEMS.work, ITEMS.work,
            ITEMS.dance, ITEMS.dance
        ],
        scenes: [

            // Scene 1: Logic Engine
            {
                id: 'scene-4-1',
                slots: [
                    // Slots 1 & 2: Entity Types
                    { id: 'slot-4-1-1', allowedTypes: ['character', 'object'], placedItemId: null, x: 160, y: 420, scale: 3, flipX: true },
                    { id: 'slot-4-1-2', allowedTypes: ['character', 'object'], placedItemId: null, x: 575, y: 420, scale: 3 },
                    // Slots 3 & 4: Action Verbs
                    { id: 'slot-4-1-3', allowedTypes: ['action'], placedItemId: null, x: 160, y: 160, scale: 2 },
                    { id: 'slot-4-1-4', allowedTypes: ['action'], placedItemId: null, x: 575, y: 160, scale: 2 },
                ],
                backgroundImage: '/assets/backgrounds/Background.png',
                outcomes: [
                    // OUTCOME A: "YOU OPENED A BOOK"
                    {
                        id: 'outcome-scholar-1',
                        itemIds: ['you', 'book', 'open', null],
                        title: 'YOU OPENED A BOOK',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    },
                    {
                        id: 'outcome-scholar-2',
                        itemIds: ['book', 'you', 'open', null],
                        title: 'YOU OPENED A BOOK',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    },
                    {
                        id: 'outcome-scholar-3',
                        itemIds: ['you', 'book', null, 'open'],
                        title: 'YOU OPENED A BOOK',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    },
                    {
                        id: 'outcome-scholar-4',
                        itemIds: ['book', 'you', null, 'open'],
                        title: 'YOU OPENED A BOOK',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    },

                    // OUTCOME B: "YOU JOINED THE CITY’S WORKFORCE"
                    {
                        id: 'outcome-workforce-1',
                        itemIds: ['you', 'group_citizens', 'work', 'work'],
                        title: 'YOU JOINED THE CITY’S WORKFORCE',
                        isSolved: true,
                        characterStates: { 'group_citizens': 'work' }
                    },
                    {
                        id: 'outcome-workforce-2',
                        itemIds: ['group_citizens', 'you', 'work', 'work'],
                        title: 'YOU JOINED THE CITY’S WORKFORCE',
                        isSolved: true,
                        characterStates: { 'group_citizens': 'work' }
                    },

                    // OUTCOME C: "YOU DANCED TO CHEER THE WORKFORCE"
                    {
                        id: 'outcome-celebration-1',
                        itemIds: ['you', 'group_citizens', 'dance', 'dance'],
                        title: 'YOU DANCED TO CHEER THE WORKFORCE',
                        isSolved: true,
                        characterStates: { 'you': 'dance', 'group_citizens': 'dance' }
                    },
                    {
                        id: 'outcome-celebration-2',
                        itemIds: ['group_citizens', 'you', 'dance', 'dance'],
                        title: 'YOU DANCED TO CHEER THE WORKFORCE',
                        isSolved: true,
                        characterStates: { 'you': 'dance', 'group_citizens': 'dance' }
                    }
                ]
            },
            // Scene 2: Visual Outcome (Fixed - Logic handled by Summary from Scene 1 state)
            {
                id: 'scene-4-2',
                slots: [], // No interaction
                backgroundImage: '/assets/backgrounds/Background-5.png',
                outcomes: []
            }
        ]
    }
];
