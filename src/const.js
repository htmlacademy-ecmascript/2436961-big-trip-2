import {nanoid} from 'nanoid';

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
export const MessageNoPoint = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now'
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const EventType = [
  'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
];

export const dateFormatConfig = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  'time_24hr': true,
  allowInput: true
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const BLANK_POINT = {
  price: 0,
  startTime: new Date(),
  endTime: new Date(),
  destination: '1',
  isFavorite: false,
  offers: [],
  type: 'taxi',
  id: nanoid(),
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
