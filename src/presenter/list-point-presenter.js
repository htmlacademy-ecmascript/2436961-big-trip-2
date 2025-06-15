import SortView from '../view/sort.js';
import PointsListView from '../view/list-points.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point-presenter.js';
import {render} from '../framework/render.js';
import {SortType} from '../const.js';
import {sortByDay, sortByTime, sortByPrice} from '../utils/point.js';

export default class ListPointPresenter {
  #sortComponent = null;
  #pointListComponent = new PointsListView();
  #eventsContainer = null;
  #pointsModel = null;
  #boardPoints = [];
  #pointsPresenters = new Map();
  #backupPoints = [];
  #currentSortType = SortType.DAY;
  #onModeChange = null;

  constructor(eventsContainer, pointsModel, onModeChange) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#onModeChange = onModeChange;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#backupPoints = [...this.#boardPoints];
    this.#sortPoints(SortType.DAY);

    this.#renderSortComponent();
    this.#renderPointListComponent();
    this.#renderListPoints();
    this.#renderNoPoint();
  }

  #renderSortComponent() {
    this.#sortComponent = new SortView({
      handleSortTypeChange: this.#handleSortTypeChange
    });
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
    if (!this.#boardPoints.length) {
      render(new NoPointView(), this.#pointListComponent.element);
    }
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints = [...this.#backupPoints].sort(sortByDay);
        break;
      case SortType.TIME:
        this.#boardPoints = [...this.#backupPoints].sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#boardPoints = [...this.#backupPoints].sort(sortByPrice);
        break;
      default:
        this.#boardPoints = [...this.#backupPoints];
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#sortPoints(sortType);
    this.#renderListPoints();
  };

  #clearPointList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }

  #changeModeEdit = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
    this.#onModeChange();
  };

  #changeFavorite = (updatedPoint) => {
    this.#boardPoints = this.#boardPoints.map((point) =>
      point.id === updatedPoint.id ? updatedPoint : point
    );
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };
}
