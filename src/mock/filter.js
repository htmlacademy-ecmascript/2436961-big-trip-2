import {filter} from '../utils/filter.js';

export function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterType,filterPoints]) => ({
      type: filterType,
      count: filterPoints(points).length,
      filteredPoints:filterPoints(points),
    }),
  );

}
