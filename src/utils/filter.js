import {FilterType} from '../const.js';
import {isPlannedPoint,isCurrentPoint,isPassedPoint} from './point.js';

export const filter = {
  [FilterType.EVERYTHING]: (points)=>points,
  [FilterType.FUTURE]:(points)=>points.filter((point)=>isPlannedPoint(point.startTime)),
  [FilterType.PRESENT]:(points)=>points.filter((point)=>isCurrentPoint(point.startTime,point.endTime)),
  [FilterType.PAST]:(points)=>points.filter((point)=>isPassedPoint(point.endTime))
};
