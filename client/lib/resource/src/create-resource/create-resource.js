import $ from 'jquery';
import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './create-resource.hbs';
import Flux from 'resource/src/flux';
// import 'common/asset/scss/resource/resource-list.scss';

class CreateResource extends BaseView {
    constructor() {
        this.actions = Flux.getActions('resource');
        this.className = 'createResource';
        this.events = {
            'submit': 'addResource',
            'change input[type="checkbox"]': 'checkResourceOwnerValidity'
        };
        super();
    }

    checkResourceOwnerValidity() {
        let isAnySelected = this.$el.find('input:checked').length > 0;
        if (isAnySelected) {
            this.$el.find('input[type="checkbox"]')[0].setCustomValidity('');
        } else {
            this.$el.find('input[type="checkbox"]')[0].setCustomValidity('Resource must have at least one owner.');
        }
    }

    addResource(e) {
        e.preventDefault();
        let {$el} = this;
        let resource_id = $el.find('#resource_id').val(),
            resource_name = $el.find('#resource_name').val(),
            resource_owners = $el
                                .find('input:checked')
                                .map(function() {
                                    return $(this).attr('id');
                                })
                                .toArray(),
            resource_description = $el.find('#resource_description').val();

        let resource = {
            id: resource_id,
            name: resource_name,
            owners: resource_owners,
            description: resource_description
        };

        this.actions.addResource(resource);
        history.navigate(`resource/${resource.id}`, { trigger: true });
    }

    render() {
        this.$el.html(Template(this.data));
        // check validity of checkboxes
        this.checkResourceOwnerValidity();
        return this;
    }
}

export default CreateResource;