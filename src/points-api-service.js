import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': Number(point.price),
      'date_from': point.startTime instanceof Date ? point.startTime.toISOString() : null,
      'date_to': point.endTime instanceof Date ? point.endTime.toISOString() : null,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.price;
    delete adaptedPoint.startTime;
    delete adaptedPoint.endTime;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
