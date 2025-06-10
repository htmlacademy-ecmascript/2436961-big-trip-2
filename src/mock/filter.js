import {filter} from '../utils/filter.js';

export function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterType,filterPoints]) => {
      const filteredPoints = filterPoints(points);
      return {
        type: filterType,
        count: filteredPoints.length,
        filteredPoints: filteredPoints,
      };
    }
  );
}
