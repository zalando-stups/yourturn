import {View} from 'backbone';

/**
 * BaseView for YourTurn.
 *
 * - Takes props in constructor, saves them to this.props
 * - If this.store is present, binds to change events for rerendering
 * - Removes this event handler on remove()
 */
class BaseView extends View {
    constructor(props) {
        this.props = props;
        this._boundRender = () => {
            this.update();
            this.render();
            return this;
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