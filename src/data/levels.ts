import type { Level, Item } from '../types';

const ITEMS: Record<string, Item> = {
    // Characters
    you: { id: 'you', name: 'You', type: 'character', icon: '/assets/you.png' },
    citizen_a: { id: 'citizen_a', name: 'Citizen A', type: 'character', icon: '🧑‍�' },
    citizen_b: { id: 'citizen_b', name: 'Citizen B', type: 'character', icon: '👷' },
    citizen_c: { id: 'citizen_c', name: 'Citizen C', type: 'character', icon: '�‍🌾' },
    citizen_d: { id: 'citizen_d', name: 'Citizen D', type: 'character', icon: '👨‍🍳' },
    group_citizens: { id: 'group_citizens', name: 'Citizens', type: 'character', icon: '👥' },

    // Objects
    book: { id: 'book', name: 'Book', type: 'object', icon: '/assets/book.png' },

    // Actions
    open: { id: 'open', name: 'Open', type: 'action', icon: '/assets/open_book.png' },
    greet: { id: 'greet', name: 'Greet', type: 'action', icon: '�' },
    interest: { id: 'interest', name: 'Interest', type: 'action', icon: '🤩' },
    work: { id: 'work', name: 'Work', type: 'action', icon: '🔨' },
    cheer: { id: 'cheer', name: 'Cheer', type: 'action', icon: '🎉' },
    special: { id: 'special', name: '?', type: 'action', icon: '❓' },
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
                    { id: 'slot-1-1-1', allowedTypes: ['character'], placedItemId: null, shape: 'ellipse', x: 600, y: 420, scale: 2 },
                    { id: 'slot-1-1-2', allowedTypes: ['object'], placedItemId: null, shape: 'ellipse', x: 320, y: 330, scale: 3 },
                ],
                backgroundImage: '/assets/scene1_bg.png',
                outcomes: [
                    {
                        id: 'outcome-1-1-solved',
                        itemIds: ['you', 'book'],
                        title: 'You found a book',
                        isSolved: true
                    }
                ]
            },
            {
                id: 'scene-1-2',
                slots: [
                    { id: 'slot-1-2-1', allowedTypes: ['character'], placedItemId: null, shape: 'ellipse', x: 200, y: 420, scale: 2 },
                    { id: 'slot-1-2-2', allowedTypes: ['action'], placedItemId: null, shape: 'rectangle', x: 400, y: 300, scale: 2 },
                    { id: 'slot-1-2-3', allowedTypes: ['object'], placedItemId: null, shape: 'ellipse', x: 600, y: 420, scale: 2 },
                ],
                backgroundImage: '/assets/scene1_bg.png',
                outcomes: [
                    {
                        id: 'outcome-1-2-solved',
                        itemIds: ['you', 'open', 'book'],
                        title: 'You opened a book',
                        isSolved: true
                    }
                ]
            },
            {
                id: 'scene-1-3',
                slots: [
                    { id: 'slot-1-3-1', allowedTypes: ['character'], placedItemId: null, shape: 'ellipse', x: 400, y: 420, scale: 2 },
                ],
                backgroundImage: '/assets/scene1_bg.png',
                outcomes: [
                    {
                        id: 'outcome-1-3-solved',
                        itemIds: ['you'],
                        title: 'You traveled into the past',
                        isSolved: true
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
                    { id: 'slot-2-1-1', allowedTypes: ['character'], placedItemId: null, x: 200, y: 400 },
                    { id: 'slot-2-1-2', allowedTypes: ['action'], placedItemId: null, x: 400, y: 250 },
                    { id: 'slot-2-1-3', allowedTypes: ['character'], placedItemId: null, x: 600, y: 400 },
                ],
                backgroundImage: '/assets/scene2_bg.png',
                outcomes: [
                    {
                        id: 'outcome-2-1-solved',
                        itemIds: ['you', 'greet', 'citizen_a'],
                        title: 'You met Citizen A for the first time and you greet each other',
                        isSolved: true
                    },
                    {
                        id: 'outcome-2-1-solved-reverse',
                        itemIds: ['citizen_a', 'greet', 'you'],
                        title: 'You met Citizen A for the first time and you greet each other',
                        isSolved: true
                    }
                ]
            },
            {
                id: 'scene-2-2',
                slots: [
                    { id: 'slot-2-2-1', allowedTypes: ['character'], placedItemId: null, x: 200, y: 400 },
                    { id: 'slot-2-2-2', allowedTypes: ['character'], placedItemId: null, x: 600, y: 400 },
                    { id: 'slot-2-2-3', allowedTypes: ['action'], placedItemId: null, x: 400, y: 250 },
                ],
                backgroundImage: '/assets/scene2_bg.png',
                outcomes: [
                    {
                        id: 'outcome-2-2-solved',
                        itemIds: ['you', 'citizen_a', 'interest'],
                        title: 'Citizen A takes you to new place and you are interested in this city',
                        isSolved: true
                    },
                    {
                        id: 'outcome-2-2-solved-reverse',
                        itemIds: ['citizen_a', 'you', 'interest'],
                        title: 'Citizen A takes you to new place and you are interested in this city',
                        isSolved: true
                    }
                ]
            },
            {
                id: 'scene-2-3',
                slots: [
                    { id: 'slot-2-3-1', allowedTypes: ['character'], placedItemId: null, x: 400, y: 400, scale: 1.5 },
                    { id: 'slot-2-3-2', allowedTypes: ['action'], placedItemId: null, x: 400, y: 200, scale: 1.2 },
                ],
                backgroundImage: '/assets/scene2_bg.png',
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
            ITEMS.citizen_b, ITEMS.citizen_b, ITEMS.citizen_b,
            ITEMS.citizen_c, ITEMS.citizen_c, ITEMS.citizen_c,
            ITEMS.citizen_d, ITEMS.citizen_d, ITEMS.citizen_d,
            ITEMS.work, ITEMS.work, ITEMS.work,
            ITEMS.special, ITEMS.special, ITEMS.special
        ],
        scenes: [
            {
                id: 'scene-3-1',
                slots: [
                    { id: 'slot-3-1-1', allowedTypes: ['character'], placedItemId: null, x: 400, y: 400 },
                    { id: 'slot-3-1-2', allowedTypes: ['action'], placedItemId: null, x: 400, y: 200 },
                ],
                backgroundImage: '/assets/scene3_bg.png',
                outcomes: [
                    {
                        id: 'outcome-3-1-b',
                        itemIds: ['citizen_b', 'work'],
                        title: 'CITIZEN B WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-1-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'CITIZEN C WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-1-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'CITIZEN D WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-1-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'CITIZEN B IS DANCING',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-1-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'CITIZEN C IS DANCING',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-1-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'CITIZEN D IS DANCING',
                        isSolved: true
                    }
                ]
            },
            {
                id: 'scene-3-2',
                slots: [
                    { id: 'slot-3-2-1', allowedTypes: ['character'], placedItemId: null, x: 400, y: 400 },
                    { id: 'slot-3-2-2', allowedTypes: ['action'], placedItemId: null, x: 400, y: 200 },
                ],
                backgroundImage: '/assets/scene3_bg.png',
                outcomes: [
                    {
                        id: 'outcome-3-2-b',
                        itemIds: ['citizen_b', 'work'],
                        title: 'CITIZEN B WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-2-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'CITIZEN C WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-2-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'CITIZEN D WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-2-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'CITIZEN B IS DANCING',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-2-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'CITIZEN C IS DANCING',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-2-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'CITIZEN D IS DANCING',
                        isSolved: true
                    }
                ]
            },
            {
                id: 'scene-3-3',
                slots: [
                    { id: 'slot-3-3-1', allowedTypes: ['character'], placedItemId: null, x: 400, y: 400 },
                    { id: 'slot-3-3-2', allowedTypes: ['action'], placedItemId: null, x: 400, y: 200 },
                ],
                backgroundImage: '/assets/scene3_bg.png',
                outcomes: [
                    {
                        id: 'outcome-3-3-b',
                        itemIds: ['citizen_b', 'work'],
                        title: 'CITIZEN B WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-3-c',
                        itemIds: ['citizen_c', 'work'],
                        title: 'CITIZEN C WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-3-d',
                        itemIds: ['citizen_d', 'work'],
                        title: 'CITIZEN D WORKS VERY HARD',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-3-b-special',
                        itemIds: ['citizen_b', 'special'],
                        title: 'CITIZEN B IS DANCING',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-3-c-special',
                        itemIds: ['citizen_c', 'special'],
                        title: 'CITIZEN C IS DANCING',
                        isSolved: true
                    },
                    {
                        id: 'outcome-3-3-d-special',
                        itemIds: ['citizen_d', 'special'],
                        title: 'CITIZEN D IS DANCING',
                        isSolved: true
                    }
                ]
            }
        ],

    },

    // -------------------------------------------------------------------------
    // LEVEL 4: It's Your Time
    // -------------------------------------------------------------------------
    {
        id: 'level-4',
        title: 'Level 4',
        goal: 'It’s your time to create your own story',
        availableItems: [
            ITEMS.you, ITEMS.you, ITEMS.you,
            ITEMS.book, ITEMS.open,
            ITEMS.work, ITEMS.work, ITEMS.work, ITEMS.work, // Enough 'work' for You+Group in S2/S3? (Needs 2 in S2, 1 in S3? No, "Group with Work"). Let's give plenty.
            ITEMS.group_citizens, ITEMS.group_citizens,
            ITEMS.cheer
        ],
        scenes: [
            {
                id: 'scene-4-1',
                slots: [
                    { id: 'slot-4-1-1', allowedTypes: ['character'], placedItemId: null, x: 200, y: 400 }, // You
                    { id: 'slot-4-1-2', allowedTypes: ['object'], placedItemId: null, x: 600, y: 400 }, // Book
                    { id: 'slot-4-1-3', allowedTypes: ['action'], placedItemId: null, x: 400, y: 250 }, // Open
                ],
                backgroundImage: '/assets/scene4_bg.png',
                outcomes: [
                    {
                        id: 'outcome-4-1-solved',
                        itemIds: ['you', 'book', 'open'],
                        title: 'BACK TO THE PRESENT',
                        isSolved: true
                    }
                ]
            },
            {
                id: 'scene-4-2',
                slots: [
                    { id: 'slot-4-2-1', allowedTypes: ['character'], placedItemId: null, x: 250, y: 400 }, // You
                    { id: 'slot-4-2-2', allowedTypes: ['action'], placedItemId: null, x: 250, y: 200 }, // Work
                    { id: 'slot-4-2-3', allowedTypes: ['character'], placedItemId: null, x: 550, y: 400 }, // Group
                    { id: 'slot-4-2-4', allowedTypes: ['action'], placedItemId: null, x: 550, y: 200 }, // Work
                ],
                backgroundImage: '/assets/scene4_bg.png',
                outcomes: [
                    {
                        id: 'outcome-4-2-solved',
                        itemIds: ['you', 'work', 'group_citizens', 'work'],
                        title: 'WORKING TOGETHER',
                        isSolved: true
                    }
                ]
            },
            {
                id: 'scene-4-3',
                slots: [
                    { id: 'slot-4-3-1', allowedTypes: ['character'], placedItemId: null, x: 250, y: 400 }, // You
                    { id: 'slot-4-3-2', allowedTypes: ['action'], placedItemId: null, x: 250, y: 200 }, // Cheer
                    { id: 'slot-4-3-3', allowedTypes: ['character'], placedItemId: null, x: 550, y: 400 }, // Group
                    { id: 'slot-4-3-4', allowedTypes: ['action'], placedItemId: null, x: 550, y: 200 }, // Work (Group is working, then starts dancing)
                ],
                backgroundImage: '/assets/scene4_bg.png',
                outcomes: [
                    {
                        id: 'outcome-4-3-solved',
                        itemIds: ['you', 'cheer', 'group_citizens', 'work'],
                        title: 'DANCE PARTY',
                        isSolved: true
                    }
                ]
            }
        ],

    },

    // -------------------------------------------------------------------------
    // FINAL PAGE: La Derniere
    // -------------------------------------------------------------------------
    {
        id: 'level-5',
        title: 'Final Chapter',
        goal: 'YOUR STORY HAS ENDED',
        availableItems: [], // No items
        scenes: [
            {
                id: 'scene-final',
                backgroundImage: '/assets/final_bg.png', // Placeholder
                slots: [],
                outcomes: [
                    {
                        id: 'outcome-final',
                        itemIds: [],
                        title: 'LA DERNIÈRE',
                        isSolved: true
                    }
                ]
            }
        ]
    }
];
