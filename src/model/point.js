import {mockPoints} from '../mock/points.js';
import {mockDestinationPoints} from '../mock/destinations.js';
import {mockOffersPoints} from '../mock/offers.js';

export default class PointsModel {
  points = mockPoints;
  offers = mockOffersPoints;
  destinations = mockDestinationPoints;

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getOfferById = (id, type) => {
    const offers = mockOffersPoints.find((item) => item.type === type).offers;
    return id.map((item) => offers.find((element) => element.id === item));
  };

  getOfferByType(type){
    const allOffers = this.getOffers();
    const offerByType = allOffers.find((offer) => offer.type === type);
    return offerByType ? offerByType.offers : [];
  }

  getDestinations() {
    return this.destinations;
  }

  getDestinationById(id) {
    const allDestination = this.getDestinations();
    return allDestination.find((item) => item.id === id);
  }
}
