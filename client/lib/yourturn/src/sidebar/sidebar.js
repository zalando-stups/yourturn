import {View} from 'backbone';
import Template from './sidebar.hbs';
import 'common/asset/scss/sidebar/sidebar.scss';

class SidebarView extends View {
    constructor() {
        this.state = {
            counter: 0
        };
        this.template = Template;
        this.tagName = 'aside';
        this.className = 'sidebar';
        this.events = {
            'click button': 'increase'
        };
        super();
    }

    increase() {
        this.state.counter += 1;
        this.render();
    }

    render() {
        this.$el.html( Template( this.state ) );
        return this;
    }
}

export default SidebarView;