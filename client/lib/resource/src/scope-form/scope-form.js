import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './scope-form.hbs';
import 'common/asset/scss/resource/scope-form.scss';

class ScopeForm extends BaseView {
    constructor(props) {
        props.className = 'scopeForm';
        props.events = {
            'submit': 'save',
            'keyup #scope_id': 'handleScopeId'
        };
        props.store = props.flux.getStore('resource');
        super(props);
        this.actions = props.flux.getActions('resource');
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
        if (this.props.flux.getStore('resource').getScope(resourceId, scope_id)) {
            $scopeInput[0].setCustomValidity('Custom ID already exists.');
            this.$el.find('.is-taken').css('display', 'inline-block');
            this.$el.find('.is-available').css('display', 'none');
        } else {
            $scopeInput[0].setCustomValidity('');
            this.$el.find('.is-taken').css('display', 'none');
            this.$el.find('.is-available').css('display', 'inline-block');
        }
    }

    update() {
        let resource = this.store.getResource(this.props.resourceId);
        this.data = {
            resource: resource,
            resourceHasOwner: resource ? resource.resource_owners.length > 0 : false
        };
        if (this.props.edit) {
            this.data.edit = this.props.edit;
            this.data.scope = this.store.getScope(this.props.resourceId, this.props.scopeId);
        }

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
            scope_ownerScope = $el.find('#scope_ownerScope:checked').length > 0,
            scope_summary = $el.find('#scope_summary').val(),
            scope_information = $el.find('#scope_information').val(),
            scope_description = $el.find('#scope_description').val();

        // construct the scope itself
        let scope = {
            is_resource_owner_scope: scope_ownerScope,
            summary: scope_summary,
            user_information: scope_information,
            description: scope_description
        };

        // send it off to the store
        this.actions.saveScope(resourceId, scope_id, scope)
            .then(() => {
                // redirect back to the resource detail view
                history.navigate(`resource/detail/${resourceId}`, { trigger: true });
            })
            .catch(() => {
                let verb = this.props.edit ? 'update' : 'create';
                this.props.notificationActions
                .addNotification(
                    `Could not ${verb} scope ${scope_id} for resource ${this.data.resource.name}.`,
                    'error'
                );
            });
    }

    render() {
        this.$el.html(Template(this.data));
        if (this.props.edit) {
            this.$el.find('is-taken').hide();
        } else {
            this.checkScopeIdAvailability();
        }
    }
}

export default ScopeForm;
