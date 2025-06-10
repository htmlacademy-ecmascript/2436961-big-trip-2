// import CreationFormView from '../view/add-point.js';
import FiltersView from '../view/filters.js';
import SortView from '../view/sort.js';
import PointsListView from '../view/list-points.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point-presenter.js';
import {render} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';
import {updateItem} from '../utils/other.js';
export default class MainPresenter {
  #filtersComponent = null;
  #sortComponent = new SortView();
  #pointListComponent = new PointsListView();
  #eventsContainer = null;
  #pointsModel = null;
  #boardPoints = [];
  #pointsPresenters = new Map();

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard(){
    this.#boardPoints = [...this.#pointsModel.points];

    this.#renderFiltersComponent();
    this.#renderSortComponent();
    this.#renderPointListComponent();
    this.#renderListPoints();
    this.#renderNoPoint();
  }

  #renderFiltersComponent(){
    this.filters = generateFilter(this.#pointsModel.points);
    this.#filtersComponent = new FiltersView({ filters: this.filters});
    const tripControlFiltersContainer = document.querySelector('.trip-controls__filters');
    render(this.#filtersComponent, tripControlFiltersContainer);
  }

  #renderSortComponent() {
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderPointListComponent() {
    render(this.#pointListComponent, this.#eventsContainer);
  }

  #renderListPoints() {
    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }
  }

  #renderPoint(pointItem) {
    const pointPresenterComponent = new PointPresenter({
      pointListComponent: this.#pointListComponent.element,
      pointsModel: this.#pointsModel,
      changeModeEdit: this.#changeModeEdit,
      changeFavorite: this.#changeFavorite
    });

    this.#pointsPresenters.set(pointItem.id, pointPresenterComponent);
    pointPresenterComponent.init(pointItem);
  }

  #renderNoPoint() {
    if (this.#boardPoints.length === 0) {
      render(new NoPointView(),this.#pointListComponent.element);
    }
  }

  #changeModeEdit = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #changeFavorite = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };
}
