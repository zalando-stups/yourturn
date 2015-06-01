import BaseView from 'common/src/base-view';
import Template from './resource-detail.hbs';
import Placeholder from './placeholder.hbs';
import Error from 'common/src/error.hbs';
import Markdown from 'common/src/markdown';
import FetchResult from 'common/src/fetch-result';
import 'common/asset/scss/resource/resource-detail.scss';

class ResourceDetail extends BaseView {
    constructor(props) {
        props.className = 'resourceDetail';
        props.stores = {
            essentials: props.flux.getStore('essentials'),
            user: props.globalFlux.getStore('user')
        };
        super(props);
    }

    update() {
        let {resourceId} = this.props,
            scopes = this.stores.essentials.getScopes(resourceId);
        this.data = {
            whitelisted: this.stores.user.isWhitelisted(),
            resourceId: resourceId,
            resource: this.stores.essentials.getResource(resourceId),
            scopes: scopes,
            ownerScopes: scopes.filter(s => s.is_resource_owner_scope),
            appScopes: scopes.filter(s => !s.is_resource_owner_scope)
        };
    }

    render() {
        let {resource} = this.data;
        if (resource instanceof FetchResult) {
            this.$el.html(
                resource.isPending() ?
                        Placeholder(this.data) :
                        Error(resource.getResult())
            );
            return this;
        }
        this.$el.html(Template(this.data));
        this.$el
            .find('[data-action="markdown"]')
            .html(Markdown.render(this.data.resource.description));
        return this;
    }
}

export default ResourceDetail;
