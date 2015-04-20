import BaseView from 'common/src/base-view';
import Template from './scope-list.hbs';
import Flux from 'resource/src/flux';
// import 'common/asset/scss/resource/resource-list.scss';

class ScopeList extends BaseView {
    constructor(props) {
        this.store = Flux.getStore('resource');
        this.actions = Flux.getActions('resource');
        this.className = 'scopeList';
        this.events = {
            'submit': 'addScope'
        };
        super(props);
    }

    addScope(e) {
        e.preventDefault();
        let scope = this.$el.find('#scope_id').val();
        this.actions.addScope(this.props.resourceId, scope);
    }

    update() {
        this.data = {
            resourceId: this.props.resourceId,
            scopes: this.store.getScopes(this.props.resourceId)
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default ScopeList;