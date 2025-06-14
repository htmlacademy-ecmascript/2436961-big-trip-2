import FiltersView from '../view/filters.js';
import {render} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';
import ListPointPresenter from './list-point-presenter.js';

export default class MainPresenter {
  #filtersComponent = null;
  #eventsContainer = null;
  #pointsModel = null;
  #listPointPresenter = null;

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    this.#renderFiltersComponent();
    this.#renderListPointPresenter();
  }

  #renderFiltersComponent() {
    this.filters = generateFilter(this.#pointsModel.points);
    this.#filtersComponent = new FiltersView({ filters: this.filters});
    const tripControlFiltersContainer = document.querySelector('.trip-controls__filters');
    render(this.#filtersComponent, tripControlFiltersContainer);
  }

  #renderListPointPresenter() {
    this.#listPointPresenter = new ListPointPresenter(
      this.#eventsContainer,
      this.#pointsModel,
      this.#handleModeChange
    );
    this.#listPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#listPointPresenter.resetView();
  };
}
