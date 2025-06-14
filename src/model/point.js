import {getRandomPoint} from '../mock/points.js';
import {mockDestinationPoints} from '../mock/destinations.js';
import {mockOffersPoints} from '../mock/offers.js';

const POINTS_COUNT = 3;
export default class PointsModel {
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
}
