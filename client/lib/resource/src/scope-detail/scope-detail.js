import BaseView from 'common/src/base-view';
import Template from './scope-detail.hbs';
import Placeholder from './placeholder.hbs';
import Error from 'common/src/error.hbs';
import Markdown from 'common/src/markdown';
import FetchResult from 'common/src/fetch-result';
import 'common/asset/scss/resource/scope-detail.scss';

class ScopeDetail extends BaseView {
    constructor(props) {
        props.className = 'scopeDetail';
        props.stores = {
            resource: props.flux.getStore('resource'),
            user: props.globalFlux.getStore('user')
        };
        super(props);
        this.actions = props.flux.getActions('resource');
    }

    update() {
        let scope = this.stores.resource.getScope(this.props.resourceId, this.props.scopeId),
            applications = this.stores.resource.getScopeApplications(this.props.resourceId, this.props.scopeId);
        this.data = {
            whitelisted: this.stores.user.isWhitelisted(),
            resourceId: this.props.resourceId,
            scopeId: this.props.scopeId,
            scope: scope,
            applications: applications
        };

    }

    render() {
        let {scope} = this.data;
        if (scope instanceof FetchResult) {
            this.$el.html(
                scope.isPending() ?
                    Placeholder(this.data) :
                    Error(scope.getResult())
            );
            return this;
        }
        this.$el.html(Template(this.data));
        this.$el
            .find('[data-action="markdown"]')
            .html(Markdown.render(this.data.scope.description));
        return this;
    }
}

export default ScopeDetail;
