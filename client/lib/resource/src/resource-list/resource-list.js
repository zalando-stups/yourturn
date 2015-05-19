import BaseView from 'common/src/base-view';
import Template from './resource-list.hbs';

class ResourceList extends BaseView {
    constructor(props) {
        super({
            className: 'resourceList',
            store: props.flux.getStore('resource'),
            events: {
                'submit': 'filter'
            }
        });
        this.state = {
            filterTerm: ''
        };
    }

    update() {
        this.data = {
            resources: this.store.getResources(this.state.filterTerm),
            filterTerm: this.state.filterTerm
        };
    }

    filter(evt) {
        evt.preventDefault();
        this.state.filterTerm = this.$el.find('input').val();
        this.update();
        this.render();
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default ResourceList;
