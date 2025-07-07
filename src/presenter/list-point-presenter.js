import SortView from '../view/sort.js';
import PointsListView from '../view/list-points.js';
import NoPointView from '../view/no-point.js';
import LoadingView from '../view/loading.js';
import ErrorLoadView from '../view/error.js';
import PointPresenter from './point-presenter.js';
import {render, remove} from '../framework/render.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {sortByDay, sortByTime, sortByPrice} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class ListPointPresenter {
  #sortComponent = null;
  #pointListComponent = new PointsListView();
  #pointsPresenters = new Map();
  #newEventButtonComponent = null;
  #noPointComponent = null;
  #loadingComponent = null;
  #errorLoadComponent = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #onModeChange = null;
  #filterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor(eventsContainer, pointsModel, filterModel, onModeChange) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#onModeChange = onModeChange;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filter[this.#filterType](points);

    switch(this.#currentSortType) {
      case SortType.DAY:
        return [...filteredPoints].sort(sortByDay);
      case SortType.PRICE:
        return [...filteredPoints].sort(sortByPrice);
      case SortType.TIME:
        return [...filteredPoints].sort(sortByTime);
    }
    return filteredPoints;
  }

  init() {
    this.#renderNewEventButtonComponent();
    if (this.#newEventButtonComponent) {
      this.#newEventButtonComponent.disabled = true;
    }
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderSortComponent();
    this.#renderPointListComponent();
    this.#renderListPoints();
    this.#renderNoPoint();
  }

  #renderSortComponent() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      handleSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderPointListComponent() {
    render(this.#pointListComponent, this.#eventsContainer);
  }

  #renderListPoints() {
    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i]);
    }
  }

  #renderPoint(pointItem) {
    const pointPresenterComponent = new PointPresenter({
      pointListComponent: this.#pointListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      changeModeEdit: this.#changeModeEdit,
      newEventButton: this.#newEventButtonComponent,
      onEmptyList: this.#renderNoPoint,
    });

    this.#pointsPresenters.set(pointItem.id, pointPresenterComponent);
    pointPresenterComponent.init(pointItem);
  }

  #renderNoPoint() {
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
      this.#noPointComponent = null;
    }

    if (!this.#isLoading && !this.points.length && !this.#newEventButtonComponent.disabled) {
      this.#noPointComponent = new NoPointView(this.#filterType);
      remove(this.#sortComponent);
      render(this.#noPointComponent, this.#pointListComponent.element);
    }
  }

  #renderLoading() {
    if (this.#isLoading) {
      this.#loadingComponent = new LoadingView();
      render(this.#loadingComponent, this.#eventsContainer);
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this.#pointsPresenters.get(update.id).setSaving();
          await this.#pointsModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          this.#pointsPresenters.forEach((presenter) => presenter.setSaving());
          await this.#pointsModel.addPoint(updateType, update);
          this.#newEventButtonComponent.disabled = false;
          break;
        case UserAction.DELETE_POINT:
          this.#pointsPresenters.get(update.id).setDeleting();
          await this.#pointsModel.deletePoint(updateType, update);
          this.#newEventButtonComponent.disabled = false;
          break;
      }
    } catch (err) {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this.#pointsPresenters.get(update.id).setAborting();
          break;
        case UserAction.ADD_POINT:
          this.#pointsPresenters.forEach((presenter) => presenter.setAborting());
          break;
        case UserAction.DELETE_POINT:
          this.#pointsPresenters.get(update.id).setAborting();
          break;
      }
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderListPoints();
        this.#renderNoPoint();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderSortComponent();
        this.#renderPointListComponent();
        this.#renderListPoints();
        this.#renderNoPoint();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearBoard();
        if (this.#newEventButtonComponent) {
          this.#newEventButtonComponent.disabled = false;
        }
        if (this.points.length === 0) {
          this.#renderPointListComponent();
          this.#renderNoPoint();
        } else {
          this.#renderSortComponent();
          this.#renderPointListComponent();
          this.#renderListPoints();
        }
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#errorLoadComponent = new ErrorLoadView();
        render(this.#errorLoadComponent, this.#eventsContainer);
        break;
    }
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#pointListComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
      this.#noPointComponent = null;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #clearPointList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
      this.#noPointComponent = null;
    }
  }

  resetView() {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  }

  #renderNewEventButtonComponent() {
    this.#newEventButtonComponent = document.querySelector('.trip-main__event-add-btn');
    this.#newEventButtonComponent.addEventListener('click', this.#handleNewEventButtonClick);
  }

  #handleNewEventButtonClick = () => {
    this.#newEventButtonComponent.disabled = true;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#onModeChange();
    this.#currentSortType = SortType.DAY;

    this.#clearBoard({resetSortType: true});
    this.#renderSortComponent();
    this.#renderPointListComponent();
    this.#renderListPoints();
    this.#renderNoPoint();

    const pointPresenter = new PointPresenter({
      pointListComponent: this.#pointListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      changeModeEdit: this.#changeModeEdit,
      newEventButton: this.#newEventButtonComponent
    });

    const newPoint = pointPresenter.createPoint();
    this.#pointsPresenters.set(newPoint, pointPresenter);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderListPoints();
    this.#renderNoPoint();
  };

  #changeModeEdit = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
    this.#onModeChange();
  };
}
