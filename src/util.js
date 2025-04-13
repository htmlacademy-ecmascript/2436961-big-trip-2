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
