import App from './components/app';
import { preCacheData, siteDataArray } from './assistFunctions/loadPreCachedData';
import './scss/main.scss';

window.addEventListener('DOMContentLoaded', () => preCacheData(siteDataArray));

new App(document.body, { type: 'main', appendType: 'prepend' }).init();
