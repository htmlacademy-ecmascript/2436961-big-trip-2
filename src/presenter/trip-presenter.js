import CreationFormView from '../view/add-point.js';
import EditorFormView from '../view/editor-point.js';
import PointsListView from '../view/list-points.js';
import PointView from '../view/point.js';
import SortView from '../view/sort.js';
import {render} from '../render.js';

export default class TripPresenter {
  pointListComponent = new PointsListView();

  constructor(eventsContainer, pointsModel) {
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];

    render(new SortView(), this.eventsContainer);

    render(this.pointListComponent, this.eventsContainer);

    render(new EditorFormView({
      point:this.boardPoints[0],
      offers:[...this.pointsModel.getOfferByType(this.boardPoints[0].type)],
      checkedOffers:[...this.pointsModel.getOfferById(this.boardPoints[0].offers,this.boardPoints[0].type)],
      destinations: this.pointsModel.getDestinationById(this.boardPoints[0].destination)
    }), this.pointListComponent.getElement());

    render(new CreationFormView(), this.pointListComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      render(
        new PointView(
          {
            point: this.boardPoints[i],
            offers: [...this.pointsModel.getOfferById(this.boardPoints[i].offers, this.boardPoints[i].type)],
            destination: this.pointsModel.getDestinationById(this.boardPoints[i].destination)
          }
        ),this.pointListComponent.getElement()
      );
    }
  }
}
