import TripInfoView from './view/trip-info.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterModel from './model/filters.js';
import PointsModel from './model/point.js';
import PointsApiService from './points-api-service.js';
import {render, RenderPosition} from './framework/render.js';

const AUTHORIZATION = 'Basic 9vt-uFa-kHk-st6';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const filterModel = new FilterModel();
const pointsModel = new PointsModel({pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)});

const headerTrip = document.querySelector('.trip-main');
render(new TripInfoView(), headerTrip, RenderPosition.AFTERBEGIN);

const filterContainer = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});

const tripEventsContainer = document.querySelector('.trip-events');
const tripPresenter = new MainPresenter(tripEventsContainer, pointsModel, filterModel);

filterPresenter.init();
tripPresenter.init();
pointsModel.init();
