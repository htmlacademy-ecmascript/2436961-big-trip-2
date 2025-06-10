export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}
