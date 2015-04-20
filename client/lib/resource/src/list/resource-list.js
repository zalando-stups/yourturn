import BaseView from 'common/src/base-view';
import Template from './resource-list.hbs';
import Flux from 'resource/src/flux';
// import 'common/asset/scss/resource/resource-list.scss';

class ResourceList extends BaseView {
    constructor() {
        this.store = Flux.getStore('resource');
        this.actions = Flux.getActions('resource');
        this.className = 'resourceList';
        this.events = {
            'submit': 'addResource'
        };
        super();
    }

    addResource(e) {
        e.preventDefault();
        let resource = this.$el.find('#resource_id').val();
        this.actions.addResource(resource);
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