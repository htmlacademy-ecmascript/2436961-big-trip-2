// import CreationFormView from '../view/add-point.js';
import FiltersView from '../view/filters.js';
import SortView from '../view/sort.js';
import PointsListView from '../view/list-points.js';
import EditorFormView from '../view/editor-point.js';
import PointView from '../view/point.js';
import NoPointView from '../view/no-point.js';
import {render, replace} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';

const tripControlFiltersContainer = document.querySelector('.trip-controls__filters');
export default class TripPresenter {
  #pointListComponent = new PointsListView();
  #eventsContainer = null;
  #pointsModel = null;
  #boardPoints = [];
  #filtersContainer = null;

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.filters = generateFilter(this.#pointsModel.points);
    this.#filtersContainer = new FiltersView({ filters: this.filters});
  }

  get boardPoints() {
    return [...this.#boardPoints];
  }

  init() {
    render(this.#filtersContainer, tripControlFiltersContainer);
    this.#boardPoints = [...this.#pointsModel.points];
    this.#renderList();
  }

  #renderList(){
    render(new SortView(), this.#eventsContainer);
    render(this.#pointListComponent, this.#eventsContainer);

    if (this.#boardPoints.length === 0){
      render(new NoPointView(),this.#pointListComponent.element);
      return;
    }

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }
  }

  #renderPoint(pointItem) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point: pointItem,
      offers: [...this.#pointsModel.getOfferById(pointItem.offers, pointItem.type)],
      destinations: this.#pointsModel.getDestinationById(pointItem.destination),
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EditorFormView({
      point: pointItem,
      offers: [...this.#pointsModel.getOfferByType(pointItem.type)],
      checkedOffers: [...this.#pointsModel.getOfferById(pointItem.offers,pointItem.type)],
      destinations: this.#pointsModel.getDestinationById(pointItem.destination),
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onClickCloseEditForm:()=>{
        replaceFormToPoint();
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointListComponent.element);
  }
}
