import BaseView from 'common/src/base-view';
import Template from './resource-list.hbs';
import Flux from 'resource/src/flux';

class ResourceList extends BaseView {
    constructor() {
        this.store = Flux.getStore('resource');
        this.actions = Flux.getActions('resource');
        this.className = 'resourceList';
        super();
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