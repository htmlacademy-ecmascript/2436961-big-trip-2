import ListPointPresenter from './list-point-presenter.js';

export default class MainPresenter {
  #eventsContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #listPointPresenter = null;

  constructor(eventsContainer, pointsModel, filterModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    this.#renderListPointPresenter();
  }

  #renderListPointPresenter() {
    this.#listPointPresenter = new ListPointPresenter(
      this.#eventsContainer,
      this.#pointsModel,
      this.#filterModel,
      this.#handleModeChange
    );
    this.#listPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#listPointPresenter.resetView();
  };
}
