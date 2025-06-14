import dayjs from 'dayjs';

export function humanizePointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

export function calculatePointDuration(start, end) {
  const startTime = dayjs(start);
  const endTime = dayjs(end);

  const durationInMinutes = endTime.diff(startTime, 'minute');
  const days = Math.floor(durationInMinutes / 1440);
  const hours = Math.floor((durationInMinutes % 1440) / 60);
  const minutes = durationInMinutes % 60;

  let durationString;

  if (durationInMinutes < 60) {
    durationString = `${minutes}M`;
  } else if (durationInMinutes < 1440) {
    durationString = `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else {
    durationString = `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return durationString;
}

export function isPlannedPoint(dueDate){
  return dayjs(dueDate).isAfter(dayjs());
}

export function isCurrentPoint(timeFrom, timeTo){
  const now = dayjs();
  return dayjs(timeFrom).isBefore(now) && dayjs(timeTo).isAfter(now);
}

export function isPassedPoint(timeTo){
  return dayjs(timeTo).isBefore(dayjs());
}

export function sortByDay(pointA, pointB) {
  return dayjs(pointA.endTime).diff(dayjs(pointB.startTime));
}

export function sortByTime(pointA, pointB) {
  const durationA = dayjs(pointA.endTime).diff(dayjs(pointA.startTime));
  const durationB = dayjs(pointB.endTime).diff(dayjs(pointB.startTime));
  return durationB - durationA;
}

export function sortByPrice(pointA, pointB) {
  return pointB.price - pointA.price;
}
