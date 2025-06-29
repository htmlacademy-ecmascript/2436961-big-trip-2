import {getRandomPoint} from '../mock/points.js';
import {mockDestinationPoints} from '../mock/destinations.js';
import {mockOffersPoints} from '../mock/offers.js';
import Observable from '../framework/observable.js';

const POINTS_COUNT = 3;
export default class PointsModel extends Observable {
  #points = Array.from({length: POINTS_COUNT}, getRandomPoint);
  #offers = mockOffersPoints;
  #destinations = mockDestinationPoints;

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  getOfferById = (id, type) => {
    const offers = this.#offers.find((item) => item.type === type).offers;
    return id.map((item) => offers.find((element) => element.id === item));
  };

  getOfferByType(type){
    const allOffers = this.offers;
    const offerByType = allOffers.find((offer) => offer.type === type);
    return offerByType ? offerByType.offers : [];
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    const allDestination = this.destinations;
    return allDestination.find((item) => item.id === id);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((item) => item.id === update.id);
    if (index !== -1) {
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);
    }
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index !== -1) {
      this.#points = [
        ...this.#points.slice(0, index),
        update,
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, update);
    }
  }
}
