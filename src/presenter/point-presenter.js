import PointView from '../view/point.js';
import EditorFormView from '../view/editor-point.js';
import AddPointFormView from '../view/add-point.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {UpdateType, UserAction, Mode, BLANK_POINT} from '../const.js';

export default class PointPresenter {
  #pointItem = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #addPointComponent = null;
  #pointListComponent = null;
  #pointsModel = null;
  #onDataChange = null;
  #changeModeEdit = null;
  #newEventButton = null;
  #mode = Mode.DEFAULT;

  constructor ({pointListComponent, pointsModel, onDataChange, changeModeEdit, newEventButton}) {
    this.#pointListComponent = pointListComponent;
    this.#pointsModel = pointsModel;
    this.#newEventButton = newEventButton;
    window.pointsModel = this.#pointsModel;
    this.#onDataChange = onDataChange;
    this.#changeModeEdit = changeModeEdit;
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
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new EditorFormView({
      point: this.#pointItem,
      offers: [...this.#pointsModel.getOfferByType(this.#pointItem.type)],
      checkedOffers: [...this.#pointsModel.getOfferById(this.#pointItem.offers,this.#pointItem.type)],
      destinations: this.#pointsModel.getDestinationById(this.#pointItem.destination),
      allDestinations: this.#pointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onClickCloseEditForm:() => {
        this.#replaceFormToPoint();
      },
      onDeleteClick: () => {
        if (this.#mode === Mode.EDITING) {
          this.#handleDeleteEdit();
        } else {
          this.#onDataChange(
            UserAction.DELETE_POINT,
            UpdateType.MINOR,
            this.#pointItem,
          );
        }
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
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  createPoint() {
    this.#mode = Mode.EDITING;
    this.#createPoint();
  }

  destroy() {
    if (this.#pointComponent) {
      remove(this.#pointComponent);
    }
    if (this.#pointEditComponent) {
      remove(this.#pointEditComponent);
    }
    if (this.#addPointComponent !== null) {
      remove(this.#addPointComponent);
    }
  }

  #createPoint = () => {
    if (this.#addPointComponent !== null) {
      return;
    }
    const point = BLANK_POINT;
    this.#pointItem = point;

    this.#escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.#handleCancelCreate();
      }
    };

    this.#addPointComponent = new AddPointFormView({
      allDestinations: this.#pointsModel.destinations,
      allOffers: this.#pointsModel,
      onFormSubmit: this.#handleFormSubmit,
      onCancel: this.#handleCancelCreate
    });

    document.addEventListener('keydown', this.#escKeyDownHandler);

    render(this.#addPointComponent, this.#pointListComponent, RenderPosition.AFTERBEGIN);
    this.#mode = Mode.NEW;
    return point;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      if (this.#addPointComponent) {
        remove(this.#addPointComponent);
        this.#addPointComponent = null;
        if (this.#newEventButton) {
          this.#newEventButton.disabled = false;
        }
      } else {
        this.#pointEditComponent.reset(this.#pointItem);
        this.#replaceFormToPoint();
      }
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.EDITING && this.#pointEditComponent) {
      const resetFormState = () => {
        this.#pointEditComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };
      this.#pointEditComponent.shake(resetFormState);
    } else if (this.#mode === Mode.DEFAULT && this.#pointComponent) {
      this.#pointComponent.shake();
    } else if (this.#addPointComponent) {
      const resetCreateFormState = () => {
        this.#addPointComponent.updateElement({
          isDisabled: false,
          isSaving: false,
        });
      };
      this.#addPointComponent.shake(resetCreateFormState);
    }
  }

  #replacePointToForm() {
    this.#changeModeEdit();
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    if (this.#addPointComponent) {
      remove(this.#addPointComponent);
      this.#addPointComponent = null;
      if (this.#newEventButton) {
        this.#newEventButton.disabled = false;
      }
    } else {
      replace(this.#pointComponent, this.#pointEditComponent);
      remove(this.#pointEditComponent);
      this.#pointEditComponent = null;
    }
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      if (this.#pointEditComponent) {
        this.#pointEditComponent.reset(this.#pointItem);
      }
      this.#replaceFormToPoint();
      if (this.#newEventButton) {
        this.#newEventButton.disabled = false;
      }
    }
  }

  #handleFavoriteClick = () => {
    const updatedPoint = {...this.#pointItem, isFavorite: !this.#pointItem.isFavorite};
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      updatedPoint
    );
  };

  #handleFormSubmit = (update) => {
    if (this.#mode === Mode.NEW) {
      this.#addPointComponent.setSaving();
      this.#onDataChange(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        update
      );
    } else {
      this.#onDataChange(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        update,
      );
    }
  };

  #handleDeleteEdit = () => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#pointItem,
    );
  };

  #handleCancelCreate = () => {
    if (this.#addPointComponent !== null) {
      remove(this.#addPointComponent);
      this.#addPointComponent = null;
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
    this.#mode = Mode.DEFAULT;
    if (this.#newEventButton) {
      this.#newEventButton.disabled = false;
    }
  };
}
