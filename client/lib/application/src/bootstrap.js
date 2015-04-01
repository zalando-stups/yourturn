import $ from 'jquery';
import {history} from 'backbone';
import Router from './router';

$(document).ready( () => {
    new Router();
    history.start({
        pushState: true
    });
});