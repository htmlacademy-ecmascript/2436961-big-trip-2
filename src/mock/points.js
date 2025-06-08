import { getRandomArrayElement } from '../utils/other.js';
import {nanoid} from 'nanoid';

export const mockPoints = [
  {
    id: 'point-1',
    type: 'taxi',
    destination: 'destination-1',
    startTime: '2025-01-01T12:00',
    endTime: '2025-01-01T15:00',
    price: 50,
    offers: ['offer-taxi-2'],
    isFavorite: false,
  },
  {
    id: 'point-2',
    type: 'bus',
    destination: 'destination-2',
    startTime: '2025-01-01T16:00',
    endTime: '2025-01-02T10:30',
    price: 30,
    offers: ['offer-bus-1'],
    isFavorite: false,
  },
  {
    id: 'point-3',
    type: 'train',
    destination: 'destination-3',
    startTime: '2025-01-02T13:30',
    endTime: '2025-01-03T17:30',
    price: 100,
    offers: ['offer-train-2'],
    isFavorite: true,
  },
  {
    id: 'point-4',
    type: 'ship',
    destination: 'destination-4',
    startTime: '2025-01-03T20:00',
    endTime: '2025-01-05T15:00',
    price: 300,
    offers: ['offer-ship-2'],
    isFavorite: true,
  },
  {
    id: 'point-5',
    type: 'drive',
    destination: 'destination-5',
    startTime: '2025-01-05T17:30',
    endTime: '2025-01-05T18:30',
    price: 250,
    offers: [
      'offer-drive-1',
      'offer-drive-2'
    ],
    isFavorite: false,
  },
];

export function getRandomPoint() {
  return {
    id: nanoid(),
    ... getRandomArrayElement(mockPoints)
  };
}
