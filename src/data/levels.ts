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
        goal: 'You discover a mysterious book that pulls you into the past.',
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
                        title: 'You find a mysterious book lying alone, waiting to be discovered.',
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
                        title: 'Curiosity takes hold as you open the book, revealing its secrets.',
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
                        title: 'A strange force pulls you in, transporting you to a different time.',
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
        goal: 'You explore an unfamiliar city alongside a new friend.',
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
                        title: 'You meet Citizen A for the first time and exchange greetings.',
                        isSolved: true,
                        characterStates: { 'you': 'greet', 'citizen_a': 'greet' }
                    },
                    {
                        id: 'outcome-2-1-solved-reverse',
                        itemIds: ['citizen_a', 'greet', 'you'],
                        title: 'You meet Citizen A for the first time and exchange greetings.',
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
                        title: 'Citizen A leads you through the city, and you become intrigued by its sights and atmosphere.',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'citizen_a': 'greet' }
                    },
                    {
                        id: 'outcome-2-2-solved-reverse',
                        itemIds: ['citizen_a', 'you', 'interest'],
                        title: 'Citizen A leads you through the city, and you become intrigued by its sights and atmosphere.',
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
                        title: 'Citizen A takes you to the workplace, where you see other citizens work.',
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
        goal: 'The citizens of this era are defined by their tireless dedication to work.',
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
                        title: 'Citizen B is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'work' }
                    },
                    {
                        id: 'outcome-3-1-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'Citizen C is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'work' }
                    },
                    {
                        id: 'outcome-3-1-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'Citizen D is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'work' }
                    },
                    {
                        id: 'outcome-3-1-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'In a rare moment of freedom, Citizen B expresses themselves through dance.',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'dance' }
                    },
                    {
                        id: 'outcome-3-1-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'In a rare moment of freedom, Citizen C expresses themselves through dance.',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'dance' }
                    },
                    {
                        id: 'outcome-3-1-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'In a rare moment of freedom, Citizen D expresses themselves through dance.',
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
                        title: 'Citizen B is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'work' }
                    },
                    {
                        id: 'outcome-3-2-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'Citizen C is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'work' }
                    },
                    {
                        id: 'outcome-3-2-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'Citizen D is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'work' }
                    },
                    {
                        id: 'outcome-3-2-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'In a rare moment of freedom, Citizen B expresses themselves through dance.',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'dance' }
                    },
                    {
                        id: 'outcome-3-2-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'In a rare moment of freedom, Citizen C expresses themselves through dance.',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'dance' }
                    },
                    {
                        id: 'outcome-3-2-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'In a rare moment of freedom, Citizen D expresses themselves through dance.',
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
                        title: 'Citizen B is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'work' }
                    },
                    {
                        id: 'outcome-3-3-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'Citizen C is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'work' }
                    },
                    {
                        id: 'outcome-3-3-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'Citizen D is completely absorbed in their tasks, working with intense focus.',
                        isSolved: true,
                        characterStates: { 'citizen_d': 'work' }
                    },
                    {
                        id: 'outcome-3-3-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'In a rare moment of freedom, Citizen B expresses themselves through dance.',
                        isSolved: true,
                        characterStates: { 'citizen_b': 'dance' }
                    },
                    {
                        id: 'outcome-3-3-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'In a rare moment of freedom, Citizen C expresses themselves through dance.',
                        isSolved: true,
                        characterStates: { 'citizen_c': 'dance' }
                    },
                    {
                        id: 'outcome-3-3-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'In a rare moment of freedom, Citizen D expresses themselves through dance.',
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
        goal: 'The Final Chapter: Your Choices Define the Future',
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
                        title: 'You choose knowledge, seeking answers within the pages of history.',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    },
                    {
                        id: 'outcome-scholar-2',
                        itemIds: ['book', 'you', 'open', null],
                        title: 'You choose knowledge, seeking answers within the pages of history.',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    },
                    {
                        id: 'outcome-scholar-3',
                        itemIds: ['you', 'book', null, 'open'],
                        title: 'You choose knowledge, seeking answers within the pages of history.',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    },
                    {
                        id: 'outcome-scholar-4',
                        itemIds: ['book', 'you', null, 'open'],
                        title: 'You choose knowledge, seeking answers within the pages of history.',
                        isSolved: true,
                        characterStates: { 'you': 'awe', 'book': 'open' }
                    },

                    // OUTCOME B: "YOU JOINED THE CITY’S WORKFORCE"
                    {
                        id: 'outcome-workforce-1',
                        itemIds: ['you', 'group_citizens', 'work', 'work'],
                        title: 'You embrace the city\'s way of life, dedicating yourself to the collective labor.',
                        isSolved: true,
                        characterStates: { 'group_citizens': 'work' }
                    },
                    {
                        id: 'outcome-workforce-2',
                        itemIds: ['group_citizens', 'you', 'work', 'work'],
                        title: 'You embrace the city\'s way of life, dedicating yourself to the collective labor.',
                        isSolved: true,
                        characterStates: { 'group_citizens': 'work' }
                    },

                    // OUTCOME C: "YOU DANCED TO CHEER THE WORKFORCE"
                    {
                        id: 'outcome-celebration-1',
                        itemIds: ['you', 'group_citizens', 'dance', 'dance'],
                        title: 'You choose joy, sparking a celebration that lifts the spirits of everyone around you.',
                        isSolved: true,
                        characterStates: { 'you': 'dance', 'group_citizens': 'dance' }
                    },
                    {
                        id: 'outcome-celebration-2',
                        itemIds: ['group_citizens', 'you', 'dance', 'dance'],
                        title: 'You choose joy, sparking a celebration that lifts the spirits of everyone around you.',
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
