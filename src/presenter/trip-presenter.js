// import CreationFormView from '../view/add-point.js';
import EditorFormView from '../view/editor-point.js';
import PointsListView from '../view/list-points.js';
import PointView from '../view/point.js';
import SortView from '../view/sort.js';
import { render, replace } from '../framework/render.js';

export default class TripPresenter {
  #pointListComponent = new PointsListView();
  #eventsContainer = null;
  #pointsModel = null;
  #boardPoints = [];

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  get boardPoints() {
    return [...this.#boardPoints];
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#renderList();
  }

  #renderList(){
    render(new SortView(), this.#eventsContainer);
    render(this.#pointListComponent, this.#eventsContainer);

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
      offers:[...this.#pointsModel.getOfferById(pointItem.offers, pointItem.type)],
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

    render(pointComponent,this.#pointListComponent.element);
  }
}
