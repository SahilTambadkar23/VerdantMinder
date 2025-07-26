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
        { id: 'l1-1', taskType: 'Water', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Soil was dry to the touch.', photoUrl: 'https://placehold.co/100x100.png' },
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
        { id: 'l3-1', taskType: 'Water', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), photoUrl: 'https://placehold.co/100x100.png' },
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
];
