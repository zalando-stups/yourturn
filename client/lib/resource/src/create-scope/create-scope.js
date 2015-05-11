import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './create-scope.hbs';
import Flux from 'resource/src/flux';
import GlobalFlux from 'yourturn/src/flux';
import Criticality from 'common/src/data/resource/scope-criticality';
import 'common/asset/scss/resource/create-scope.scss';

class CreateScope extends BaseView {
    constructor(props) {
        props.className = 'createScope';
        props.events = {
            'submit': 'save',
            'keyup #scope_id': 'handleScopeId'
        };
        props.store = Flux.getStore('resource');
        super(props);
        this.actions = Flux.getActions('resource');
    }

    handleScopeId() {
        this.syncScopeId();
        this.checkScopeIdAvailability();
    }

    syncScopeId() {
        this.$el.find('[data-action="sync-with-scope-id"]').text(this.$el.find('#scope_id').val());
    }

    /**
     * Checks the resource store if a scope with this ID
     * already exists. Shows or hides according input-addon.
     */
    checkScopeIdAvailability() {
        let {resourceId} = this.props;
        let $scopeInput = this.$el.find('#scope_id');
        let scope_id = $scopeInput.val();
        if (Flux.getStore('resource').getScope(resourceId, scope_id)) {
            $scopeInput[0].setCustomValidity('Custom ID already exists.');
            this.$el.find('.is-taken').show();
            this.$el.find('.is-available').hide();
        } else {
            $scopeInput[0].setCustomValidity('');
            this.$el.find('.is-taken').hide();
            this.$el.find('.is-available').show();
        }
    }

    update() {
        let resource = this.store.getResource(this.props.resourceId);
        this.data = {
            resource: resource,
            resourceHasOwner: resource ? resource.owners.length > 0 : false,
            criticalities: Criticality
        };
    }

    /**
     * Saves the scope to the resource store.
     */
    save(e) {
        e.preventDefault();
        // gather data from DOM
        // validity is ensured by the browser
        let {resourceId} = this.props,
            {$el} = this,
            scope_id = $el.find('#scope_id').val(),
            scope_criticality = parseInt($el.find('[name="yourturn_scope_criticality"]:checked').val(), 10),
            scope_ownerScope = $el.find('#scope_ownerScope:checked').length > 0,
            scope_summary = $el.find('#scope_summary').val(),
            scope_information = $el.find('#scope_information').val(),
            scope_description = $el.find('#scope_description').val();

        // construct the scope itself
        let scope = {
            id: scope_id,
            criticality: scope_criticality,
            ownerScope: scope_ownerScope,
            summary: scope_summary,
            information: scope_information,
            description: scope_description
        };

        // send it off to the store
        this.actions.saveScope(resourceId, scope)
            .then(() => {
                // redirect back to the resource detail view
                history.navigate(`resource/detail/${resourceId}`, { trigger: true });
            })
            .catch(() => {
                GlobalFlux
                .getActions('notification')
                .addNotification(
                    `Could not save scope ${scope_id} for resource ${this.data.resource.name}.`,
                    'error'
                );
            });
    }

    render() {
        this.$el.html(Template(this.data));
        this.checkScopeIdAvailability();
        return this;
    }
}

export default CreateScope;
