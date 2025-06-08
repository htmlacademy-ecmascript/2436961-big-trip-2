import EditorFormView from '../view/editor-point.js';
import PointView from '../view/point.js';
import {render, replace, remove} from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointItem = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #pointListComponent = null;
  #pointsModel = null;
  #changeModeEdit = null;
  #changeFavorite = null;
  #mode = Mode.DEFAULT;

  constructor ({pointListComponent, pointsModel, changeModeEdit, changeFavorite}) {
    this.#pointListComponent = pointListComponent;
    this.#pointsModel = pointsModel;
    this.#changeModeEdit = changeModeEdit;
    this.#changeFavorite = changeFavorite;
  }

  init(oneItem) {
    this.#pointItem = oneItem;
    this.#renderPoint();
  }

  #renderPoint() {
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#pointItem,
      offers: [...this.#pointsModel.getOfferById(this.#pointItem.offers, this.#pointItem.type)],
      destinations: this.#pointsModel.getDestinationById(this.#pointItem.destination),
      onEditClick: () => {
        this.#replacePointToForm();
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new EditorFormView({
      point: this.#pointItem,
      offers: [...this.#pointsModel.getOfferByType(this.#pointItem.type)],
      checkedOffers: [...this.#pointsModel.getOfferById(this.#pointItem.offers,this.#pointItem.type)],
      destinations: this.#pointsModel.getDestinationById(this.#pointItem.destination),
      onFormSubmit: () => {
        this.#replaceFormToPoint();
      },
      onClickCloseEditForm:()=>{
        this.#replaceFormToPoint();
      }
    });

    render(this.#pointComponent, this.#pointListComponent);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    this.#changeModeEdit();
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHandler);

  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #handleFavoriteClick = () => {
    this.#changeFavorite({...this.#pointItem, isFavorite: !this.#pointItem.isFavorite});
  };
}
