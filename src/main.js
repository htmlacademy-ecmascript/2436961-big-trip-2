import TripPresenter from './presenter/trip-presenter.js';
import FiltersView from './view/filters.js';
import {render} from './render.js';

const tripControlFiltersContainer = document.querySelector('.trip-controls__filters');
render(new FiltersView(), tripControlFiltersContainer);

const tripEventsContainer = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter(tripEventsContainer);
tripPresenter.init();
