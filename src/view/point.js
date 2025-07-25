import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDate, calculatePointDuration} from '../utils/point.js';

function createPointTemplate(point, offers, destinations) {
  const {startTime, endTime, isFavorite} = point;
  const startDate = humanizePointDate(startTime, 'MMM D');
  const startСlock = humanizePointDate(startTime, 'HH:mm');
  const endСlock = humanizePointDate(endTime, 'HH:mm');
  const duration = calculatePointDuration(startTime, endTime);
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return (`<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${startDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${point.type} ${destinations.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T10:30">${startСlock}</time>
                    —
                    <time class="event__end-time" datetime="2019-03-18T11:00">${endСlock}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  €&nbsp;<span class="event__price-value">${point.price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offers.map((item) => `<li class="event__offer">
                  <span class="event__offer-title">${item.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${item.price}</span>
                  </li>`).join('')}
                </ul>
                <button class="event__favorite-btn ${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`);
}

export default class PointView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;


  constructor({point, offers, destinations, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    const rollupButton = this.element.querySelector('.event__rollup-btn');
    const favoriteButton = this.element.querySelector('.event__favorite-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#editClickHandler);
    }
    if (favoriteButton) {
      favoriteButton.addEventListener('click', this.#favoriteClickHandler);
    }
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
