import {View} from 'backbone';
import toHyper from 'html2hscript';
import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

class BaseView extends View {
    constructor(props) {
        this.props = props;
        this._vdom = createElement(h(this.tagName));
        document.body.appendChild(this._vdom);
        this._boundRender = () => {
            this.update();
            let html = this.render();
            toHyper( html, (err, hyper) => {
                let patches = diff(this._vdom, hyper);
                let root = patch(this._vdom, patches);
                this._vdom = root;
            });
        };
        this.bind();
        super();
    }

    bind() {
        if (this.store) {
            this.store.on('change', this._boundRender);
        }
    }

    unbind() {
        if (this.store) {
            this.store.off('change', this._boundRender);
        }
    }

    remove() {
        this.unbind();
    }
}

export default BaseView;