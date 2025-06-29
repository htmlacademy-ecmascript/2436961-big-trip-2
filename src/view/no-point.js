import AbstractView from '../framework/view/abstract-view.js';
import {MessageNoPoint} from '../const.js';

function createNoPointTemplate(currentFilterType) {
  const message = MessageNoPoint[currentFilterType];
  return `<p class='trip-events__msg'>${message}</p>`;
}
export default class NoPointView extends AbstractView {
  #currentFilterType = null;

  constructor(filterType) {
    super();
    this.#currentFilterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#currentFilterType);
  }
}
