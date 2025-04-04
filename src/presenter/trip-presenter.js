import CreationFormView from '../view/add-point.js';
import EditorFormView from '../view/editor-point.js';
import PointsListView from '../view/list-points.js';
import PointView from '../view/point.js';
import SortView from '../view/sort.js';
import {render} from '../render.js';

export default class TripPresenter {
  pointListComponent = new PointsListView();

  constructor(eventsContainer) {
    this.eventsContainer = eventsContainer;
  }

  init() {
    render(new SortView(), this.eventsContainer);

    render(this.pointListComponent, this.eventsContainer);

    render(new EditorFormView(), this.pointListComponent.getElement());
    render(new CreationFormView(), this.pointListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  }
}
