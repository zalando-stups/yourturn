import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './create-scope.hbs';
import Flux from 'resource/src/flux';

class CreateScope extends BaseView {
    constructor(props) {
        this.actions = Flux.getActions('resource');
        this.className = 'createScope';
        this.events = {
            'submit': 'addScope'
        };
        super(props);
    }

    update() {
        this.data = {
            resourceId: this.props.resourceId
        };
    }

    addScope(e) {
        e.preventDefault();
        let {resourceId} = this.props,
            {$el} = this,
            scope_id = $el.find('#scope_id').val(),
            scope_criticality = parseInt($el.find('#scope_criticality>option:selected').first().val(), 10),
            scope_ownerScope = $el.find('#scope_ownerScope:selected').length > 0,
            scope_summary = $el.find('#scope_summary').val(),
            scope_description = $el.find('#scope_description').val();

        let scope = {
            id: scope_id,
            criticality: scope_criticality,
            ownerScope: scope_ownerScope,
            summary: scope_summary,
            description: scope_description
        };

        this.actions.addScope(resourceId, scope);
        history.navigate(`resource/${resourceId}`, { trigger: true });
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default CreateScope;