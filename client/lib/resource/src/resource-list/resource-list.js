import BaseView from 'common/src/base-view';
import Template from './resource-list.hbs';

class ResourceList extends BaseView {
    constructor(props) {
        super({
            className: 'resourceList',
            store: props.flux.getStore('resource')
        });
        this.actions = props.flux.getActions('resource');
    }

    update() {
        this.data = {
            resources: this.store.getResources()
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default ResourceList;
