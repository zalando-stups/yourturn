import $ from 'jquery';
import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './create-resource.hbs';
import Flux from 'resource/src/flux';
import 'common/asset/scss/resource/create-resource.scss';

class CreateResource extends BaseView {
    constructor() {
        super({
            className: 'createResource',
            events: {
                'submit': 'save'
            }
        });
        this.actions = Flux.getActions('resource');
    }

    /**
     * Saves this resource to the store.
     */
    save(e) {
        e.preventDefault();
        // gather data from DOM
        let {$el} = this,
            resource_id = $el.find('#resource_id').val(),
            resource_name = $el.find('#resource_name').val(),
            resource_owners = $el
                                .find('input:checked')
                                .map(function() {
                                    return $(this).attr('id');
                                })
                                .toArray(),
            resource_description = $el.find('#resource_description').val();

        // construct resource
        let resource = {
            id: resource_id,
            name: resource_name,
            owners: resource_owners,
            description: resource_description
        };

        // save the resource
        this.actions.saveResource(resource);
        // redirect to detail view of the newly created resource
        history.navigate(`resource/detail/${resource.id}`, { trigger: true });
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default CreateResource;