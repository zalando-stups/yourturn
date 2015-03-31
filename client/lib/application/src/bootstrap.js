import $ from 'jquery';
import {history} from 'backbone';
import Router from './router';
import App from './app';

$(document).ready( () => {
    let app = new App();
    app.render();

    $(document.body).append( app.$el );
    new Router();
    history.start({
        pushState: true
    });
});