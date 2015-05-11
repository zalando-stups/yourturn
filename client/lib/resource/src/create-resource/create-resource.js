import $ from 'jquery';
import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './create-resource.hbs';
import Flux from 'resource/src/flux';
import GlobalFlux from 'yourturn/src/flux';
import 'common/asset/scss/resource/create-resource.scss';

class CreateResource extends BaseView {
    constructor(props) {
        super({
            className: 'createResource',
            events: {
                'submit': 'save',
                'keyup #resource_id': 'checkResourceIdAvailability'
            }
        });
        this.actions = props.flux.getActions('resource');
    }

    /**
     * Checks the resource store if a resource with this ID
     * already exists. Shows or hides according input-addon.
     */
    checkResourceIdAvailability() {
        let $resourceInput = this.$el.find('#resource_id');
        let resource_id = $resourceInput.val();
        if (Flux.getStore('resource').getResource(resource_id)) {
            $resourceInput[0].setCustomValidity('Resource ID already exists.');
            this.$el.find('.is-taken').show();
            this.$el.find('.is-available').hide();
        } else {
            $resourceInput[0].setCustomValidity('');
            this.$el.find('.is-taken').hide();
            this.$el.find('.is-available').show();
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
        this.actions.saveResource(resource)
            .then(() => {
                // redirect to detail view of the newly created resource
                history.navigate(`resource/detail/${resource.id}`, { trigger: true });
            })
            .catch(() => {
                GlobalFlux
                .getActions('notification')
                .addNotification(
                    `Could not save resource ${resource.name}.`,
                    'error'
                );
            });
    }

    render() {
        this.$el.html(Template(this.data));
        this.checkResourceIdAvailability();
        return this;
    }
}

export default CreateResource;
