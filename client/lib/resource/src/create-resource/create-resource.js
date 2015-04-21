import $ from 'jquery';
import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './create-resource.hbs';
import Flux from 'resource/src/flux';

class CreateResource extends BaseView {
    constructor() {
        this.actions = Flux.getActions('resource');
        this.className = 'createResource';
        this.events = {
            'submit': 'save',
            'change input[type="checkbox"]': 'checkResourceOwnerValidity'
        };
        super();
    }

    /**
     * Checks if at least one of the checkboxes was selected and sets
     * customValidity on the first.
     */
    checkResourceOwnerValidity() {
        let isAnySelected = this.$el.find('input:checked').length > 0;
        if (isAnySelected) {
            this.$el.find('input[type="checkbox"]')[0].setCustomValidity('');
        } else {
            this.$el.find('input[type="checkbox"]')[0].setCustomValidity('Resource must have at least one owner.');
        }
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
        // check validity of checkboxes
        // otherwise they would be considered valid from the beginning
        this.checkResourceOwnerValidity();
        return this;
    }
}

export default CreateResource;