import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/point.js';
import FiltersView from './view/filters.js';
import {render} from './framework/render.js';

const tripControlFiltersContainer = document.querySelector('.trip-controls__filters');
render(new FiltersView(), tripControlFiltersContainer);

const tripEventsContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter(tripEventsContainer, pointsModel);
tripPresenter.init();
