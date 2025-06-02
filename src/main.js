import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/point.js';
import TripInfoView from './view/trip-info.js';
import {render, RenderPosition} from './framework/render.js';

const pointsModel = new PointsModel();

const headerTrip = document.querySelector('.trip-main');
render(new TripInfoView(), headerTrip, RenderPosition.AFTERBEGIN);

const tripEventsContainer = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter(tripEventsContainer, pointsModel);
tripPresenter.init();
