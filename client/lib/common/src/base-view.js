import {View} from 'backbone';
import _ from 'lodash';

/**
 * BaseView for YourTurn.
 *
 * - Takes props in constructor, saves them to this.props
 * - If this.store is present, binds to change events for rerendering
 * - Removes this event handler on remove()
 */
class BaseView extends View {
    constructor(props) {
        super(props);
        this.props = props;
        this._boundRender = () => {
            this.update();
            this.render();
            return this;
        };
        this.bind();
    }

    bind() {
        if (this.store) {
            this.store.on('change', this._boundRender);
        }
        if (this.stores) {
            _.forOwn(this.stores, (val, key) => this.stores[key].on('change', this._boundRender));
        }
    }

    update() {}

    unbind() {
        if (this.store) {
            this.store.off('change', this._boundRender);
        }
        if (this.stores) {
            _.forOwn(this.stores, (val, key) => this.stores[key].off('change', this._boundRender));
        }
    }

    remove() {
        this.unbind();
    }
}

export default BaseView;