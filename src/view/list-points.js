import AbstractView from '../framework/view/abstract-view.js';

const pointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointsListView extends AbstractView {
  get template() {
    return pointListTemplate();
  }
}
