import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './create-scope.hbs';
import Flux from 'resource/src/flux';

class CreateScope extends BaseView {
    constructor(props) {
        this.actions = Flux.getActions('resource');
        this.className = 'createScope';
        this.events = {
            'submit': 'save'
        };
        super(props);
    }

    update() {
        this.data = {
            resourceId: this.props.resourceId
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
            scope_criticality = parseInt($el.find('#scope_criticality>option:selected').first().val(), 10),
            scope_ownerScope = $el.find('#scope_ownerScope:checked').length > 0,
            scope_summary = $el.find('#scope_summary').val(),
            scope_description = $el.find('#scope_description').val();

        // construct the scope itself
        let scope = {
            id: scope_id,
            criticality: scope_criticality,
            ownerScope: scope_ownerScope,
            summary: scope_summary,
            description: scope_description
        };

        // send it off to the store
        this.actions.saveScope(resourceId, scope);
        // redirect back to the resource detail view
        history.navigate(`resource/detail/${resourceId}`, { trigger: true });
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default CreateScope;