import type { Plant } from './types';

export const initialPlants: Plant[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    type: 'Tropical',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A large, popular houseplant with iconic split leaves. Likes bright, indirect light and well-draining soil.',
    schedule: [
      { id: 's1-1', type: 'Water', frequencyDays: 7, lastCompleted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 's1-2', type: 'Fertilize', frequencyDays: 30, lastCompleted: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    log: [
        { id: 'l1-1', taskType: 'Water', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Soil was dry to the touch.' },
    ],
  },
  {
    id: '2',
    name: 'Snake Plant',
    type: 'Succulent',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'Extremely hardy and low-maintenance. Tolerates low light and infrequent watering.',
    schedule: [
      { id: 's2-1', type: 'Water', frequencyDays: 21, lastCompleted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    log: [],
  },
  {
    id: '3',
    name: 'Fiddle Leaf Fig',
    type: 'Ficus',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A stylish plant with large, violin-shaped leaves. Can be finicky and requires consistent care.',
    schedule: [
      { id: 's3-1', type: 'Water', frequencyDays: 10, lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 's3-2', type: 'Prune', frequencyDays: 90, lastCompleted: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    log: [
        { id: 'l3-1', taskType: 'Water', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
    {
    id: '4',
    name: 'Pothos',
    type: 'Vine',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A forgiving and fast-growing vine, perfect for beginners. Trails beautifully from hanging baskets.',
    schedule: [
      { id: 's4-1', type: 'Water', frequencyDays: 10, lastCompleted: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    log: [],
  },
  {
    id: '5',
    name: 'Spider Plant',
    type: 'Air-purifying',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'Known for its arching leaves and ability to produce "pups". Very easy to care for and propagate.',
    schedule: [
      { id: 's5-1', type: 'Water', frequencyDays: 7, lastCompleted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: [
      { id: 'l5-1', taskType: 'Water', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Watered thoroughly.' }
    ]
  },
  {
    id: '6',
    name: 'ZZ Plant',
    type: 'Low-light',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'Zamioculcas zamiifolia is drought-tolerant and accepts low-light conditions without fuss.',
    schedule: [
      { id: 's6-1', type: 'Water', frequencyDays: 25, lastCompleted: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: []
  },
  {
    id: '7',
    name: 'Rubber Plant',
    type: 'Ficus',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A popular houseplant with dark, glossy leaves. Prefers bright, indirect light and can grow quite tall.',
    schedule: [
      { id: 's7-1', type: 'Water', frequencyDays: 14, lastCompleted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 's7-2', type: 'Fertilize', frequencyDays: 60, lastCompleted: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: [
      { id: 'l7-1', taskType: 'Water', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: '8',
    name: 'Calathea Orbifolia',
    type: 'Prayer Plant',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'Beautiful round leaves with silver stripes. Requires high humidity and consistently moist soil.',
    schedule: [
      { id: 's8-1', type: 'Water', frequencyDays: 5, lastCompleted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: []
  },
  {
    id: '9',
    name: 'Boston Fern',
    type: 'Fern',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'Loves high humidity and indirect light, making it a great bathroom plant. Features feathery, green fronds.',
    schedule: [
      { id: 's9-1', type: 'Water', frequencyDays: 4, lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: [
      { id: 'l9-1', taskType: 'Water', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Misted leaves as well.' }
    ]
  },
  {
    id: '10',
    name: 'Peace Lily',
    type: 'Flowering',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'Known for its beautiful white spathes and air-purifying qualities. It will droop dramatically when it needs water.',
    schedule: [
      { id: 's10-1', type: 'Water', frequencyDays: 6, lastCompleted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: []
  },
  {
    id: '11',
    name: 'Succulent Mix',
    type: 'Succulent',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A small collection of various succulents in a single pot. Great for sunny windowsills.',
    schedule: [
      { id: 's11-1', type: 'Water', frequencyDays: 20, lastCompleted: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: []
  },
  {
    id: '12',
    name: 'Orchid',
    type: 'Flowering',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'Elegant flowering plant that can be tricky to care for but rewards with beautiful blooms. Likes specific orchid potting mix.',
    schedule: [
      { id: 's12-1', type: 'Water', frequencyDays: 9, lastCompleted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: []
  },
  {
    id: '13',
    name: 'Air Plant',
    type: 'Tillandsia',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A unique plant that doesn\'t require soil to grow. It absorbs nutrients and water through its leaves.',
    schedule: [
      { id: 's13-1', type: 'Water', frequencyDays: 10, lastCompleted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: []
  },
  {
    id: '14',
    name: 'Jade Plant',
    type: 'Succulent',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A popular good-luck plant with fleshy, oval-shaped leaves. It is relatively easy to care for and can live for a long time.',
    schedule: [
      { id: 's14-1', type: 'Water', frequencyDays: 20, lastCompleted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: []
  },
  {
    id: '15',
    name: 'Areca Palm',
    type: 'Palm',
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A popular and elegant palm with arching fronds. It helps in purifying the air and is relatively easy to grow indoors.',
    schedule: [
      { id: 's15-1', type: 'Water', frequencyDays: 7, lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    log: []
  }
];
