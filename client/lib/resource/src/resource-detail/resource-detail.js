import BaseView from 'common/src/base-view';
import Template from './resource-detail.hbs';
import Markdown from 'common/src/markdown';
import 'common/asset/scss/resource/resource-detail.scss';

class ResourceDetail extends BaseView {
    constructor(props) {
        props.className = 'resourceDetail';
        props.store = props.flux.getStore('resource');
        super(props);
    }

    update() {
        let scopes = this.store.getScopes(this.props.resourceId);
        this.data = {
            resource: this.store.getResource(this.props.resourceId),
            scopes: scopes,
            ownerScopes: scopes.filter(s => s.ownerScope),
            appScopes: scopes.filter(s => !s.ownerScope)
        };
    }

    render() {
        this.$el.html(Template(this.data));
        this.$el
            .find('[data-action="markdown"]')
            .html(Markdown.render(this.data.resource.description));
        return this;
    }
}

export default ResourceDetail;
