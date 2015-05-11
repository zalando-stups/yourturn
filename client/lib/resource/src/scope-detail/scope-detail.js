import BaseView from 'common/src/base-view';
import Template from './scope-detail.hbs';
import Markdown from 'common/src/markdown';
import Criticality from 'common/src/data/resource/scope-criticality';
import 'common/asset/scss/resource/scope-detail.scss';

class ScopeDetail extends BaseView {
    constructor(props) {
        props.className = 'scopeDetail';
        props.store = props.flux.getStore('resource');
        super(props);
        this.actions = props.flux.getActions('resource');
    }

    update() {
        let scope = this.store.getScope(this.props.resourceId, this.props.scopeId);
        let applications = this.store.getScopeApplications(this.props.resourceId, this.props.scopeId);
        this.data = {
            resourceId: this.props.resourceId,
            scope: scope,
            applications: applications,
            scopeCriticality: Criticality[scope.criticality]
        };

    }

    render() {
        this.$el.html(Template(this.data));
        this.$el
            .find('[data-action="markdown"]')
            .html(Markdown.render(this.data.scope.description));
        return this;
    }
}

export default ScopeDetail;
