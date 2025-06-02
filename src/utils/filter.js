import {FilterType} from '../const.js';
import {isPlannedPoint,isCurrentPoint,isPassedPoint} from './point.js';

export const filter = {
  [FilterType.EVERYTHING]: (points)=>points,
  [FilterType.FUTURE]:(points)=>points.filter((point)=>isPlannedPoint(point.dateFrom)),
  [FilterType.PRESENT]:(points)=>points.filter((point)=>isCurrentPoint(point.dateFrom,point.dateTo)),
  [FilterType.PAST]:(points)=>points.filter((point)=>isPassedPoint(point.dateTo))
};
