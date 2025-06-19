import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDate} from '../utils/point.js';
import {EventType} from '../const.js';

function createOffersOfPointTemplate(offers, checkedOffers) {
  const {title, price, id} = offers;
  const isChecked = checkedOffers.some((checkedOffer) => checkedOffer.id === id);
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-luggage-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
}

function createEventTypeItemsTemplate(currentType) {
  return EventType.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"${currentType === type ? ' checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>
  `).join('');
}

function createEditorFormTemplate(point, offers, checkedOffers, destinations, allDestinations) {
  return (`<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${destinations.id}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${destinations.id}" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createEventTypeItemsTemplate(point.type)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${destinations.id}">
                      ${point.type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations.city}" list="destination-list-${destinations.id}">
                    <datalist id="destination-list-${destinations.id}">
                      ${allDestinations.map((item) => `<option value="${item.city}"></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDate(point.startTime, ' DD/MM/YY HH:mm')}">
                    —
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDate(point.endTime, ' DD/MM/YY HH:mm')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      €
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${destinations.id}" type="text" name="event-price" value="${point.price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${offers.map((offer)=>createOffersOfPointTemplate(offer, checkedOffers)).join(' ')}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinations.description}</p>
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${destinations.pictures.map((item) => `<img class="event__photo" src=${item.src} alt="Event photo">`).join('')}
                      </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`);
}

export default class EditorFormView extends AbstractStatefulView {
  #allDestinations = null;
  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({point, offers, checkedOffers, destinations, allDestinations, onFormSubmit, onClickCloseEditForm}) {
    super();
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onClickCloseEditForm;

    this._state = {
      point,
      offers,
      checkedOffers,
      destinations
    };

    this._restoreHandlers();
  }

  get template() {
    return createEditorFormTemplate(
      this._state.point,
      this._state.offers,
      this._state.checkedOffers,
      this._state.destinations,
      this.#allDestinations
    );
  }

  static parsePointToState = ({point}) => ({...point});

  static parseStateToPoint = (state) => ({...state.point});

  reset = (point) => this.updateElement(EditorFormView.parsePointToState({point}));

  #formSubmitHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit(EditorFormView.parseStateToPoint(this._state));
  };

  #editCloseClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleEditClick();
  };

  #changeTypeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    const offers = window.pointsModel.getOfferByType(newType);
    this.updateElement({
      point: {
        ...this._state.point,
        type: newType,
        offers: []
      },
      offers: offers,
      checkedOffers: [],
    });
  };

  #changeDestinationHandler = (evt) => {
    evt.preventDefault();
    const newCity = evt.target.value;
    const newDestination = this.#allDestinations.find((item) => item.city === newCity);
    this.updateElement({
      point: {
        ...this._state.point,
        destination: newDestination.id
      },
      destinations: newDestination
    });
  };

  _restoreHandlers = () => {
    this.element.querySelector('form').addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#editCloseClickHandler);
    this.element.querySelectorAll('.event__type-input').forEach((element) => element.addEventListener('change', this.#changeTypeHandler));
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
  };
}
