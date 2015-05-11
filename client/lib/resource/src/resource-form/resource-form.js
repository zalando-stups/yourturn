import $ from 'jquery';
import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './resource-form.hbs';
import {constructLocalUrl} from 'common/src/data/services';
import 'common/asset/scss/resource/resource-form.scss';

class ResourceForm extends BaseView {
    constructor(props) {
        props.className = 'resourceForm';
        props.store = props.flux.getStore('resource');
        props.events = {
            'submit': 'save',
            'keyup #resource_id': 'checkResourceIdAvailability'
        };
        super(props);
        this.actions = props.flux.getActions('resource');
    }

    /**
     * Checks the resource store if a resource with this ID
     * already exists. Shows or hides according input-addon.
     */
    checkResourceIdAvailability() {
        console.log(this);
        let $resourceInput = this.$el.find('#resource_id');
        let resource_id = $resourceInput.val();
        if (this.store.getResource(resource_id)) {
            $resourceInput[0].setCustomValidity('Resource ID already exists.');
            this.$el.find('.is-taken').show();
            this.$el.find('.is-available').hide();
        } else {
            $resourceInput[0].setCustomValidity('');
            this.$el.find('.is-taken').hide();
            this.$el.find('.is-available').show();
        }
    }

    update() {
        this.data = {
            edit: this.props.edit,
            resource: this.store.getResource(this.props.resourceId)
        };
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
            name: resource_name,
            resource_owners: resource_owners,
            description: resource_description
        };
        console.log(resource_id, resource);
        // save the resource
        this.actions.saveResource(resource_id, resource)
            .then(() => {
                // redirect to detail view of the resource
                return history.navigate(constructLocalUrl('resource-type', [resource_id]), { trigger: true });
            })
            .catch(e => {
                console.log(e);
                this.props.notificationActions.addNotification(
                    `Could not save resource ${resource.name}.`,
                    'error'
                );
            });
    }

    render() {
        this.$el.html(Template(this.data));
        if (this.props.edit) {
            this.$el.find('.is-taken').hide();
        } else {
            this.checkResourceIdAvailability();
        }
        return this;
    }
}

export default ResourceForm;
