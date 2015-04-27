import BaseView from 'common/src/base-view';
import Template from './resource-list.hbs';
import Flux from 'resource/src/flux';

class ResourceList extends BaseView {
    constructor() {
        super({
            className: 'resourceList',
            store: Flux.getStore('resource')
        });
        this.actions = Flux.getActions('resource');
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