import $ from 'jquery';

class Puppeteer {
    constructor() {
        this.active = false;
    }

    show( view, target ) {
        if (this.active) {
            this.active.remove();
        }
        let el;
        if (typeof target === 'undefined' ) {
            el = $('body');
        }
        if (typeof target === 'string' ) {
            el = $(target);
        }
        el.html( view.render().$el );
        this.active = view;
    }
}

export default new Puppeteer();