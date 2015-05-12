import $ from 'jquery';

class Puppeteer {
    constructor() {
        this.active = false;
    }

    show(view, target) {
        if (this.active && typeof this.active.remove === 'function') {
            this.active.remove();
        }
        let el;
        if (typeof target === 'undefined') {
            el = $('body');
        }
        if (typeof target === 'string') {
            el = $(target);
        }
        if (typeof view === 'object') {
            el.html(view._boundRender().$el);
        }
        if (typeof view === 'string') {
            el.html(view);
        }
        this.active = view;
    }
}

export default new Puppeteer();